import envConfig from '@config/env/env.config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  RawBodyRequest,
  UnauthorizedException,
} from '@nestjs/common';
import { IncomingMessage } from 'http';
import { validateHmacSignature } from '@libs/helpers/hmac';

@Injectable()
export class SendCloudWebhookGuard implements CanActivate {
  private readonly logger = new Logger(SendCloudWebhookGuard.name);
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<RawBodyRequest<IncomingMessage>>();

    const hmacHeader = req.headers['sendcloud-signature'] as string;

    if (!hmacHeader || typeof hmacHeader !== 'string') {
      this.logger.error(`HMAC header not found in request`);
      throw new UnauthorizedException(`Not Authorized`);
    }

    if (!req.rawBody) {
      this.logger.error(`Could not find raw body in request`);
      throw new InternalServerErrorException(`Raw body not found`);
    }

    if (
      !validateHmacSignature(
        req.rawBody,
        envConfig.externalServices.sendCloud.webhookSecretKey,
        hmacHeader,
        'hex',
      )
    ) {
      this.logger.error(`HMAC header does not match generated hash`);
      throw new UnauthorizedException(`Not Authorized`);
    }

    return true;
  }
}
