import envConfig from '@config/env/env.config';
import { Injectable } from '@nestjs/common';

const validHeaderKeys = [envConfig.appJwtSecret, envConfig.appScriptsSecret];

@Injectable()
export class AuthService {
  validateBearerToken(bearerToken: string) {
    return validHeaderKeys.includes(bearerToken);
  }
}
