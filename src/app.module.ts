import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractorsService } from './modules/contractors/contractors.service';
import { ContractorsController } from './modules/contractors/contractors.controller';
import { SpeditionOrdersService } from './modules/spedition-orders/spedition-orders.service';
import { SpeditionOrdersController } from './modules/spedition-orders/spedition-orders.controller';
import { SettingsController } from './modules/settings/settings.controller';
import { SpeditionOrderStatusService } from './modules/spedition-orders/spedition-order-status.service';
import { NewOrderIdService } from './modules/spedition-orders/new-order-id.service';
import { AuthenticationTokenCheckMiddleware } from './auth/authentication-token-check.middleware';
import { UsersService } from './modules/users/users.service';
import { UsersController } from './modules/users/users.controller';
import { UserDetailsController } from './modules/users/user-details.controller';
import { SpeditionOrdersFeedService } from './modules/spedition-orders/spedition-orders-feed.service';
import { SpeditionOrdersFeedController } from './modules/spedition-orders/spedition-orders-feed.controller';
import { DynamoDBSpeditionOrderRepository } from './infra/dynamodb/spedition-orders/spedition-order.repository';
import { SettingsService } from './modules/settings/settings.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    ContractorsController,
    SpeditionOrdersFeedController,
    SpeditionOrdersController,
    SettingsController,
    UsersController,
    UserDetailsController,
  ],
  providers: [
    AppService,
    ContractorsService,
    DynamoDBSpeditionOrderRepository,
    NewOrderIdService,
    SettingsService,
    SpeditionOrdersFeedService,
    SpeditionOrdersService,
    SpeditionOrderStatusService,
    UsersService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationTokenCheckMiddleware).forRoutes('/');
  }
}
