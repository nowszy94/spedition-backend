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
import { DynamoDBSpeditionOrderRepository } from './infra/dynamodb/spedition-orders/dynamodb-spedition-order.repository';
import { SettingsService } from './modules/settings/settings.service';
import { SpeditionOrderFilesController } from './modules/spedition-orders/spedition-orders-files.controller';
import { SpeditionOrderFilesService } from './modules/spedition-orders/spedition-order-files.service';
import { ContractorFilesController } from './modules/contractors/contractor-files.controller';
import { ContractorFilesService } from './modules/contractors/contractor-files.service';
import { RefreshSpeditionOrdersService } from './modules/spedition-orders/refresh-spedition-orders.service';
import { SpeditionOrdersSearchService } from './modules/spedition-orders/spedition-orders-search.service';
import { CompanyLogoService } from './modules/settings/company-logo.service';
import { CompanyLogoController } from './modules/settings/company-logo.controller';

// import { RefreshSpeditionOrdersController } from './modules/spedition-orders/refresh-spedition-orders.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    CompanyLogoController,
    ContractorsController,
    ContractorFilesController,
    // RefreshSpeditionOrdersController,
    SpeditionOrdersFeedController,
    SpeditionOrderFilesController,
    SpeditionOrdersController,
    SettingsController,
    UsersController,
    UserDetailsController,
  ],
  providers: [
    AppService,
    CompanyLogoService,
    ContractorsService,
    ContractorFilesService,
    DynamoDBSpeditionOrderRepository,
    NewOrderIdService,
    RefreshSpeditionOrdersService,
    SettingsService,
    SpeditionOrdersFeedService,
    SpeditionOrderFilesService,
    SpeditionOrdersSearchService,
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
