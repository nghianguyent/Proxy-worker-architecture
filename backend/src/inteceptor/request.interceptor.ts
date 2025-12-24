import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<Request>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    const userIp = request.ip;

    return next.handle().pipe(
      map((data) => ({
        data,
        userIp,
      })),
    );
  }
}
