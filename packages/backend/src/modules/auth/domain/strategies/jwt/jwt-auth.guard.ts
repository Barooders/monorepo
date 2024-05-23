import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(
    ...args: Parameters<
      InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']
    >
  ) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (args[0]) this.logger.debug(`Error when Authenticating: ${args[0]}`);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (args[2]) this.logger.debug(`Authentication Info: ${args[2]}`);

    return super.handleRequest(...args);
  }
}
