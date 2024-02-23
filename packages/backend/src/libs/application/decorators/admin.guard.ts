import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AdminGuard.name);

  handleRequest(
    ...args: Parameters<
      InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']
    >
  ) {
    const user = args[1] as ExtractedUser;

    if (!user.roles.includes('admin')) {
      throw new UnauthorizedException('User does not have admin role');
    }

    return super.handleRequest(...args);
  }
}
