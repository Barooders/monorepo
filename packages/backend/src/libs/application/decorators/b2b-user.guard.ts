import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HASURA_ROLES } from 'shared-types';

@Injectable()
export class B2BUserGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(B2BUserGuard.name);

  handleRequest(
    ...args: Parameters<
      InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']
    >
  ) {
    const user = args[1] as ExtractedUser;

    if (!user.roles.includes(HASURA_ROLES.B2B_USER)) {
      throw new UnauthorizedException('User does not have b2b_user role');
    }

    return super.handleRequest(...args);
  }
}
