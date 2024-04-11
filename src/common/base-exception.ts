import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception';

export abstract class BaseException extends Error {
  constructor(
    message: string,
    public statusCode: HttpStatus,
  ) {
    super(message);
  }

  toHttpException = (details?: HttpExceptionOptions) => {
    return new HttpException(this.message, this.statusCode, details);
  };
}

export abstract class BaseExceptionFilter<T extends BaseException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response.status(exception.statusCode).json({
      statusCode: exception.statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
