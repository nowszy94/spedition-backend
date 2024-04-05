import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractorsService } from './modules/contractors/contractors.service';
import { ContractorsController } from './modules/contractors/contractors.controller';
import { SpeditionOrdersService } from './modules/spedition-orders/spedition-orders.service';
import { SpeditionOrdersController } from './modules/spedition-orders/spedition-orders.controller';
import { SettingsController } from './modules/settings/settings.controller';
import { SpeditionOrderStatusService } from './modules/spedition-orders/spedition-order-status.service';
import { NewOrderIdService } from './modules/spedition-orders/new-order-id.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    ContractorsController,
    SpeditionOrdersController,
    SettingsController,
  ],
  providers: [
    AppService,
    ContractorsService,
    NewOrderIdService,
    SpeditionOrdersService,
    SpeditionOrderStatusService,
  ],
})
export class AppModule {}
