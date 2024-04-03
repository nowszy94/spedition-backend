import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractorsService } from './modules/contractors/contractors.service';
import { ContractorsController } from './modules/contractors/contractors.controller';
import { SpeditionOrdersService } from './modules/spedition-orders/spedition-orders.service';
import { SpeditionOrdersController } from './modules/spedition-orders/spedition-orders.controller';
import { SettingsController } from './modules/settings/settings.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    ContractorsController,
    SpeditionOrdersController,
    SettingsController,
  ],
  providers: [AppService, ContractorsService, SpeditionOrdersService],
})
export class AppModule {}
