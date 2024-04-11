import {
  BaseException,
  BaseExceptionFilter,
} from '../../common/base-exception';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';

export class UnauthenticatedException extends BaseException {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

@Catch(UnauthenticatedException)
export class UnauthenticatedExceptionFilter extends BaseExceptionFilter<UnauthenticatedException> {
  catch(exception: UnauthenticatedException, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
