import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractorsService } from './contractors/contractors.service';
import { ContractorsController } from './contractors/contractors.controller';
import { SpeditionOrdersService } from './spedition-orders/spedition-orders.service';
import { SpeditionOrdersController } from './spedition-orders/spedition-orders.controller';
import { SettingsController } from './settings/settings.controller';

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
