import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CatchFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responsePayload: unknown =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message = (() => {
      if (typeof responsePayload === 'string') {
        return responsePayload;
      }

      if (
        responsePayload &&
        typeof responsePayload === 'object' &&
        'message' in responsePayload
      ) {
        const payloadMessage = (responsePayload as { message?: unknown })
          .message;

        if (Array.isArray(payloadMessage)) {
          return payloadMessage.join(', ');
        }

        if (typeof payloadMessage === 'string') {
          return payloadMessage;
        }
      }

      return 'Internal server error';
    })();

    const errorMessage =
      exception instanceof Error ? exception.message : String(message);

    this.logger.error(
      `Request ${request?.method} ${request?.url} failed: ${errorMessage}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: request?.url,
    });
  }
}
