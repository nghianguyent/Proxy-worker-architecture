import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  EntityNotFoundError,
  OptimisticLockVersionMismatchError,
  QueryFailedError,
  TypeORMError,
} from 'typeorm';
import { ErrorResponse } from './dto/error.response';
import { DriverError } from 'src/common/types/error.type';
import {
  PostgresErrorMap,
  PostgresErrorMessages,
} from 'src/common/constants/error.constants';
import { ETypeormError } from 'src/common/enum/error.enum';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TypeORMExceptionFilter.name);

  handleMessageMap({
    messageTemplate,
    driverError,
  }: {
    messageTemplate: string;
    driverError: DriverError;
  }): string {
    Object.entries(driverError).forEach(([key, value]) => {
      messageTemplate = messageTemplate?.replace(`{${key}}`, String(value));
    });

    return messageTemplate;
  }

  handleQueryException(
    exception: QueryFailedError<DriverError>,
  ): ErrorResponse {
    const driverError = exception.driverError;
    const code = driverError.code;
    const status = PostgresErrorMap[code] || HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.handleMessageMap({
      messageTemplate: PostgresErrorMessages[code],
      driverError,
    });
    return {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  handleEntityNotFound(_exception: EntityNotFoundError): ErrorResponse {
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Entity not found',
      timestamp: new Date().toISOString(),
    };
  }

  handleOptimisticLockVersionMismatchError(
    _exception: OptimisticLockVersionMismatchError,
  ): ErrorResponse {
    return {
      statusCode: HttpStatus.CONFLICT,
      message: 'Optimistic lock version mismatch',
      timestamp: new Date().toISOString(),
    };
  }

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const error = exception instanceof TypeORMError ? exception : null;

    let errorResponse: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
    };

    switch (error?.name) {
      case ETypeormError.QueryFailedError:
        errorResponse = this.handleQueryException(
          error as QueryFailedError<DriverError>,
        );
        break;
      case ETypeormError.EntityNotFound:
        errorResponse = this.handleEntityNotFound(error as EntityNotFoundError);
        break;
      case ETypeormError.OptimisticLockVersionMismatchError:
        errorResponse = this.handleOptimisticLockVersionMismatchError(
          error as OptimisticLockVersionMismatchError,
        );
        break;
      default:
    }

    this.logger.error(exception as QueryFailedError);

    response.status(errorResponse.statusCode).json({
      ...errorResponse,
      path: request?.url,
    });
  }
}
