import { Injectable } from '@nestjs/common';
import envConfig from '@config/env/env.config';

const validHeaderKeys = [envConfig.appJwtSecret];

@Injectable()
export class AuthService {
  validateBearerToken(bearerToken: string) {
    return validHeaderKeys.includes(bearerToken);
  }
}
