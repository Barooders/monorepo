import { ExceptionBase } from '@libs/domain/exceptions';
import { ApiErrorResponse } from '@libs/infrastructure/hasura/api-error.response';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestContextService } from '../context/app-request-context';

export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(ExceptionInterceptor.name);

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError((initialError) => {
        let updatedError = this.addCorrelationIdToError(initialError);
        updatedError = this.mapValidationError(updatedError);
        updatedError = this.mapUncatchedError(updatedError);
        updatedError = this.mapPrismaNotFoundError(updatedError);

        const isNotFoundError = updatedError.status === 404;
        const loggedMessage = `[${RequestContextService.getRequestId()}] ${
          updatedError.message
        }`;

        if (isNotFoundError) {
          this.logger.warn(loggedMessage, updatedError.stack);
        } else {
          this.logger.error(loggedMessage, updatedError.stack);
          Sentry.captureException(updatedError);
        }

        return throwError(updatedError);
      }),
    );
  }

  private addCorrelationIdToError(error: any) {
    const correlationId =
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      error.correlationId || RequestContextService.getRequestId();

    error.correlationId = correlationId;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!error.response) return error;

    error.response.correlationId = correlationId;

    return error;
  }

  private mapValidationError(error: any) {
    //TODO: clean this condition
    const isClassValidatorError =
      Array.isArray(error?.response?.message) &&
      typeof error?.response?.error === 'string' &&
      error.status === 400;

    if (!isClassValidatorError) return error;

    return new BadRequestException(
      new ApiErrorResponse({
        statusCode: error.status,
        message: 'Validation error',
        error: error?.response?.error,
        subErrors: error?.response?.message,
        correlationId: RequestContextService.getRequestId(),
      }),
    );
  }

  private mapUncatchedError(error: any) {
    if (error.name !== 'Error') return error;

    return new BadRequestException(error);
  }

  private mapPrismaNotFoundError(error: any) {
    if (error.name !== 'NotFoundError') return error;

    return new NotFoundException(error);
  }
}
