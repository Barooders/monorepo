import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

type SharedContext = Record<string, string>;

@Injectable()
export class LoggerService extends PinoLogger {
  private sharedContext?: SharedContext;

  error(message: string, ...args: string[]) {
    super.error({ sharedContext: this.sharedContext, context: args }, message);
  }

  warn(message: string, ...args: string[]) {
    super.warn({ sharedContext: this.sharedContext, context: args }, message);
  }

  info(message: string, ...args: string[]) {
    super.info({ sharedContext: this.sharedContext, context: args }, message);
  }

  debug(message: string, ...args: string[]) {
    super.debug({ sharedContext: this.sharedContext, context: args }, message);
  }

  trace(message: string, ...args: string[]) {
    super.trace({ sharedContext: this.sharedContext, context: args }, message);
  }

  log(message: string, ...args: string[]) {
    super.info({ sharedContext: this.sharedContext, context: args }, message);
  }

  setSharedContext(context: SharedContext) {
    this.sharedContext = context;
  }
}
