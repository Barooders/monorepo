import { appConfig } from '@config/app.config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const CLAIMS_KEY = 'https://hasura.io/jwt/claims';

type HasuraAuthJwtType = {
  [CLAIMS_KEY]: {
    'x-hasura-sellerName'?: string;
    'x-hasura-allowed-roles': string[];
    'x-hasura-default-role': string;
    'x-hasura-user-id': string;
    'x-hasura-user-is-anonymous': 'true' | 'false';
  };
  sub: string;
  iat: number;
  exp: number;
  iss: 'hasura-auth';
};

export type ExtractedUser = {
  sellerName?: string;
  userId: string;
  roles: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: process.env.NODE_ENV !== 'production',
      secretOrKey: appConfig.loginJwtSecret,
    });
  }

  async validate(payload: HasuraAuthJwtType): Promise<ExtractedUser> {
    const parsedSellerName = payload[CLAIMS_KEY]['x-hasura-sellerName'];
    return {
      ...(parsedSellerName ? { sellerName: parsedSellerName } : {}),
      userId: payload[CLAIMS_KEY]['x-hasura-user-id'],
      roles: payload[CLAIMS_KEY]['x-hasura-allowed-roles'],
    };
  }
}
