import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { SpeditionOrdersService } from './spedition-orders.service';
import { CreateSpeditionOrderDto } from './dto/create-spedition-order.dto';
import { UpdateSpeditionOrderDto } from './dto/update-spedition-order.dto';
import {
  PatchSpeditionOrderContractorDto,
  PatchSpeditionOrderDto,
  PatchSpeditionOrderLoadingCompletedDto,
  PatchSpeditionOrderOrderIdDto,
  PatchSpeditionOrderStatusDto,
  PatchSpeditionOrderUnloadingCompletedDto,
} from './dto/patch-spedition-order.dto';
import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from '../users/entities/user.entity';
import {
  mapToSpeditionOrdersFilters,
  SpeditionOrderFilterRequestDto,
} from './dto/spedition-order-filters.dto';
import { SpeditionOrder } from './entities/spedition-order.entity';
import { SpeditionOrdersSearchService } from './spedition-orders-search.service';

const DEFAULT_SPEDITION_ORDERS_LIMIT = 150;

@Controller('spedition-orders')
export class SpeditionOrdersController {
  private readonly logger = new Logger(SpeditionOrdersController.name);

  constructor(
    private readonly speditionOrdersService: SpeditionOrdersService,
    private readonly speditionOrdersSearchService: SpeditionOrdersSearchService,
  ) {}

  @Get()
  async findAll(
    @UserDecorator() user: User,
    @Query() filtersDto: SpeditionOrderFilterRequestDto,
  ) {
    this.logger.debug('Called findAll spedition-orders endpoint');
    const filters = mapToSpeditionOrdersFilters(filtersDto);
    const query = filtersDto.query;

    if (!query && !filters) {
      return await this.speditionOrdersService.findAllWithLimit(
        user.companyId,
        DEFAULT_SPEDITION_ORDERS_LIMIT,
      );
    }

    let speditionOrders: Array<SpeditionOrder> = [];

    if (filters) {
      speditionOrders = await this.speditionOrdersService.findAllByFilters(
        user.companyId,
        filters,
      );
    } else {
      speditionOrders = await this.speditionOrdersService.findAll(
        user.companyId,
      );
    }

    if (query) {
      return this.speditionOrdersSearchService.searchOrders(
        speditionOrders,
        query,
      );
    }

    return speditionOrders;
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserDecorator() user: User) {
    this.logger.debug(`Called findOne spedition-orders endpoint (id: ${id})`);
    return this.speditionOrdersService.findOne(id, user.companyId);
  }

  @Post()
  create(
    @Body() createSpeditionOrderDto: CreateSpeditionOrderDto,
    @Query('status') status: string,
    @UserDecorator() user: User,
  ) {
    this.logger.debug('Called create spedition-orders endpoint');

    if (status === 'DRAFT') {
      return this.speditionOrdersService.createDraftSpeditionOrder(
        user,
        createSpeditionOrderDto,
      );
    }

    return this.speditionOrdersService.createActiveSpeditionOrder(
      user,
      createSpeditionOrderDto,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpeditionOrderDto: UpdateSpeditionOrderDto,
    @UserDecorator() user: User,
  ) {
    this.logger.debug(`Called update spedition-orders endpoint (id: ${id})`);

    return this.speditionOrdersService.update(
      id,
      user.companyId,
      updateSpeditionOrderDto,
    );
  }

  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() patchSpeditionOrderDto: PatchSpeditionOrderDto,
    @UserDecorator() user: User,
  ) {
    if (this.isStatusPatch(patchSpeditionOrderDto)) {
      this.logger.debug(
        `Called patch status spedition-orders endpoint (id: ${id})`,
      );

      return this.speditionOrdersService.changeStatus(
        id,
        user,
        patchSpeditionOrderDto.status,
      );
    }

    if (this.isOrderIdPatch(patchSpeditionOrderDto)) {
      this.logger.debug(
        `Called patch orderId spedition-orders endpoint (id: ${id})`,
      );

      return this.speditionOrdersService.changeOrderId(
        id,
        user.companyId,
        patchSpeditionOrderDto.orderId,
      );
    }

    if (this.isContractorPatch(patchSpeditionOrderDto)) {
      this.logger.debug(
        `Called patch contractor spedition-orders endpoint (id: ${id})`,
      );

      return this.speditionOrdersService.changeContractor(
        id,
        user.companyId,
        patchSpeditionOrderDto.contractor,
      );
    }

    if (this.isLoadingCompletedPatch(patchSpeditionOrderDto)) {
      this.logger.debug(
        `Called patch loading completed spedition-orders endpoint (id: ${id})`,
      );

      return this.speditionOrdersService.changeLoadingCompleted(
        id,
        user.companyId,
        patchSpeditionOrderDto.loadingCompleted,
      );
    }

    if (this.isUnloadingCompletedPatch(patchSpeditionOrderDto)) {
      this.logger.debug(
        `Called patch unloading completed spedition-orders endpoint (id: ${id})`,
      );

      return this.speditionOrdersService.changeUnloadingCompleted(
        id,
        user.companyId,
        patchSpeditionOrderDto.unloadingCompleted,
      );
    }

    this.logger.debug(
      `[BUG from frontend] Called unknown patch spedition-orders endpoint (id: ${id})`,
    );

    return null; // TODO add error to return 400
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @UserDecorator() user: User) {
    this.logger.debug('Called remove spedition-orders endpoint');
    await this.speditionOrdersService.remove(id, user.companyId);
  }

  private isStatusPatch = (
    dto: PatchSpeditionOrderDto,
  ): dto is PatchSpeditionOrderStatusDto => {
    return 'status' in dto;
  };

  private isOrderIdPatch = (
    dto: PatchSpeditionOrderDto,
  ): dto is PatchSpeditionOrderOrderIdDto => {
    return 'orderId' in dto;
  };

  private isContractorPatch = (
    dto: PatchSpeditionOrderDto,
  ): dto is PatchSpeditionOrderContractorDto => {
    return 'contractor' in dto;
  };

  private isLoadingCompletedPatch = (
    dto: PatchSpeditionOrderDto,
  ): dto is PatchSpeditionOrderLoadingCompletedDto => {
    return 'loadingCompleted' in dto;
  };

  private isUnloadingCompletedPatch = (
    dto: PatchSpeditionOrderDto,
  ): dto is PatchSpeditionOrderUnloadingCompletedDto => {
    return 'unloadingCompleted' in dto;
  };
}
