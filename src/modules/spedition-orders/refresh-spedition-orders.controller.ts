import { Controller, Get, Logger, Post } from '@nestjs/common';
import * as fs from 'node:fs';

import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from '../users/entities/user.entity';
import { RefreshSpeditionOrdersService } from './refresh-spedition-orders.service';
import { SpeditionOrdersService } from './spedition-orders.service';

@Controller()
export class RefreshSpeditionOrdersController {
  private readonly logger = new Logger(RefreshSpeditionOrdersController.name);

  constructor(
    private readonly refreshSpeditionOrdersService: RefreshSpeditionOrdersService,
    private readonly speditionOrdersService: SpeditionOrdersService,
  ) {}

  @Get('/spedition-orders-refresh')
  async backupSpeditionOrders(@UserDecorator() user: User) {
    this.logger.debug('Called refresh spedition-orders endpoint get');

    const result = await this.speditionOrdersService.findAll(user.companyId);

    this.logger.debug(`Saving ${result.length} spedition orders`);

    fs.writeFileSync('./spedition-orders-backup.json', JSON.stringify(result));
  }

  @Post('/spedition-orders-refresh')
  async refreshOrders(@UserDecorator() user: User) {
    this.logger.debug('Called refresh spedition-orders endpoint');

    await this.refreshSpeditionOrdersService.refreshOrders(user.companyId);
  }
}
