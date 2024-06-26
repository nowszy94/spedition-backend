import { Controller, Get, Logger } from '@nestjs/common';
import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from '../users/entities/user.entity';
import { SpeditionOrdersFeedService } from './spedition-orders-feed.service';
import { SpeditionOrderFeedResponse } from './entities/spedition-orders-feed.entity';

@Controller('spedition-orders-feed')
export class SpeditionOrdersFeedController {
  private readonly logger = new Logger(SpeditionOrdersFeedController.name);

  constructor(
    private readonly speditionOrdersFeedService: SpeditionOrdersFeedService,
  ) {}

  @Get()
  find(@UserDecorator() user: User): Promise<SpeditionOrderFeedResponse> {
    this.logger.debug('Called find spedition-orders-feed endpoint');
    return this.speditionOrdersFeedService.getSpeditionOrdersFeed(
      user.companyId,
    );
  }
}
