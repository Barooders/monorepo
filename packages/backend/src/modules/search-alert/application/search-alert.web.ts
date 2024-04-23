import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { routesV1 } from '@config/routes.config';

import { User } from '@libs/application/decorators/user.decorator';
import { UUID } from '@libs/domain/value-objects';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { SearchAlertService } from '../domain/search-alert.service';

class UpdateSavedSearchDTO {
  @ApiProperty()
  @IsBoolean()
  shouldTriggerAlerts!: boolean;
}

@Controller(routesV1.version)
export class SearchAlertController {
  constructor(private searchAlertService: SearchAlertService) {}

  @Put(routesV1.searchAlert.savedSearch)
  @UseGuards(JwtAuthGuard)
  async updateSavedSearch(
    @Param('savedSearchId') savedSearchId: string,
    @Body()
    { shouldTriggerAlerts }: UpdateSavedSearchDTO,
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
      shouldTriggerAlerts,
    );
  }

  @Delete(routesV1.searchAlert.savedSearch)
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
