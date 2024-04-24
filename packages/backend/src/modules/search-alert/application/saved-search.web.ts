import { routesV1 } from '@config/routes.config';
import { User } from '@libs/application/decorators/user.decorator';
import { SavedSearchType } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SearchAlertService } from '../domain/search-alert.service';

class RefinementDTO {
  @ApiProperty()
  @IsString()
  attribute!: string;

  @ApiProperty()
  @IsString()
  type!: string;

  @ApiProperty()
  @IsString()
  label!: string;

  @ApiProperty()
  value!: string | number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  operator?: string;
}

class CreateSavedSearchDTO {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsEnum(SavedSearchType)
  type!: SavedSearchType;

  @ApiProperty()
  @IsString()
  resultsUrl!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  collectionId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({ isArray: true, minItems: 1, type: RefinementDTO })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RefinementDTO)
  refinements!: RefinementDTO[];

  @ApiProperty()
  @IsBoolean()
  shouldTriggerAlerts!: boolean;
}

const mapFacetFilters = (refinements: RefinementDTO[]) => {
  return refinements
    .filter((refinement) => refinement.type === 'disjunctive')
    .map((refinement) => ({
      facetName: refinement.attribute,
      value: String(refinement.value),
      label: String(refinement.label),
    }));
};

const mapNumericFilters = (refinements: RefinementDTO[]) => {
  return refinements
    .filter((refinement) => refinement.type === 'numeric')
    .map((refinement) => ({
      facetName: refinement.attribute,
      value: String(refinement.value),
      operator: String(refinement.operator),
    }));
};

@Controller(routesV1.version)
export class SavedSearchController {
  constructor(private searchAlertService: SearchAlertService) {}

  @Post(routesV1.savedSearch.root)
  @UseGuards(JwtAuthGuard)
  async createSavedSearch(
    @Body()
    { refinements, ...createSavedSearchDTO }: CreateSavedSearchDTO,
    @User() { userId }: ExtractedUser,
  ): Promise<string> {
    if (!userId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }

    return await this.searchAlertService.createSavedSearch(
      new UUID({ uuid: userId }),
      {
        ...createSavedSearchDTO,
        facetFilters: mapFacetFilters(refinements),
        numericFilters: mapNumericFilters(refinements),
      },
    );
  }

  @Put(routesV1.savedSearch.one)
  @UseGuards(JwtAuthGuard)
  async updateSavedSearch(
    @Param('savedSearchId') savedSearchId: string,
    @Body()
    { refinements, ...createSavedSearchDTO }: Partial<CreateSavedSearchDTO>,
    @User() { userId }: ExtractedUser,
  ): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }

    await this.searchAlertService.updateSavedSearch(
      new UUID({ uuid: userId }),
      new UUID({ uuid: savedSearchId }),
      {
        ...createSavedSearchDTO,
        ...(refinements && {
          facetFilters: mapFacetFilters(refinements),
          numericFilters: mapNumericFilters(refinements),
        }),
      },
    );
  }

  @Delete(routesV1.savedSearch.one)
  @UseGuards(JwtAuthGuard)
  async deleteSavedSearch(
    @Param('savedSearchId') savedSearchId: string,
    @User() { userId }: ExtractedUser,
  ): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }

    await this.searchAlertService.deleteSavedSearch(
      new UUID({ uuid: userId }),
      new UUID({ uuid: savedSearchId }),
    );
  }
}
