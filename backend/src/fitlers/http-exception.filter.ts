import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from './dto/error.response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const responsePayload = exception.getResponse();

    const { message, error } = (() => {
      if (typeof responsePayload === 'string') {
        return {
          message: responsePayload,
          error: undefined as string | undefined,
        };
      }

      if (
        responsePayload &&
        typeof responsePayload === 'object' &&
        'message' in responsePayload
      ) {
        const payloadMessage = (responsePayload as { message?: unknown })
          .message;
        const payloadError = (responsePayload as { error?: unknown }).error;

        const normalizedMessage = Array.isArray(payloadMessage)
          ? payloadMessage.join(', ')
          : typeof payloadMessage === 'string'
            ? payloadMessage
            : 'Http exception';

        const normalizedError =
          typeof payloadError === 'string' ? payloadError : undefined;

        return { message: normalizedMessage, error: normalizedError };
      }

      return {
        message: 'Http exception',
        error: undefined as string | undefined,
      };
    })();

    this.logger.error(
      `Request ${request?.method} ${request?.url} failed: ${message}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request?.url,
    } as ErrorResponse);
  }
}
