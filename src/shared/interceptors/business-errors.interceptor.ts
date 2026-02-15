/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  NotFoundException,
  PreconditionFailedException,
  BadRequestException,
} from '@nestjs/common/exceptions';
import { BusinessError, BusinessErrorCode } from '../errors/business-error';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof BusinessError) {
          switch (err.code) {
            case BusinessErrorCode.NOT_FOUND:
              return throwError(() => new NotFoundException(err.message));
            case BusinessErrorCode.PRECONDITION_FAILED:
              return throwError(
                () => new PreconditionFailedException(err.message),
              );
            case BusinessErrorCode.BAD_REQUEST:
              return throwError(() => new BadRequestException(err.message));
            default:
              return throwError(() => err);
          }
        }
        return throwError(() => err);
      }),
    );
  }
}