import * as moment from 'moment';
import * as momentTz from 'moment-timezone';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnauthenticatedExceptionFilter } from './auth/exceptions/unauthenticated.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new UnauthenticatedExceptionFilter());
  await app.listen(80);

  moment.locale('pl-PL');
  momentTz.tz('Poland');
}
bootstrap();
