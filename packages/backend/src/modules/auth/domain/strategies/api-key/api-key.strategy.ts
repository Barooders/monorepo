import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'header-api-key',
) {
  constructor(private authService: AuthService) {
    super(
      { header: 'x-api-key', prefix: 'Api-Key ' },
      true,
      (bearerToken: string, done: (...args: any[]) => void) => {
        const isValidBearer = this.authService.validateBearerToken(bearerToken);

        if (isValidBearer) return done(null, true);

        done(new UnauthorizedException(), false);
      },
    );
  }
}
