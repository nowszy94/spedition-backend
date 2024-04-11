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
  PatchSpeditionOrderDto,
  PatchSpeditionOrderOrderIdDto,
  PatchSpeditionOrderStatusDto,
} from './dto/patch-spedition-order.dto';
import { User } from '../../auth/user.decorator';
import { KnownUser } from '../../auth/known-users.mock';

@Controller('spedition-orders')
export class SpeditionOrdersController {
  private readonly logger = new Logger(SpeditionOrdersController.name);

  constructor(
    private readonly speditionOrdersService: SpeditionOrdersService,
  ) {}

  @Get()
  findAll(@User() user: KnownUser) {
    this.logger.log('Called findAll spedition-orders endpoint');
    return this.speditionOrdersService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: KnownUser) {
    this.logger.log(`Called findOne spedition-orders endpoint (id: ${id})`);
    return this.speditionOrdersService.findOne(id, user.companyId);
  }

  @Post()
  create(
    @Body() createSpeditionOrderDto: CreateSpeditionOrderDto,
    @Query('status') status: string,
    @User() user: KnownUser,
  ) {
    this.logger.log('Called create spedition-orders endpoint');

    if (status === 'DRAFT') {
      return this.speditionOrdersService.createDraftSpeditionOrder(
        user.companyId,
        createSpeditionOrderDto,
        user,
      );
    }

    return this.speditionOrdersService.createActiveSpeditionOrder(
      user.companyId,
      createSpeditionOrderDto,
      user,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpeditionOrderDto: UpdateSpeditionOrderDto,
    @User() user: KnownUser,
  ) {
    this.logger.log(`Called update spedition-orders endpoint (id: ${id})`);

    return this.speditionOrdersService.update(
      id,
      user.companyId,
      updateSpeditionOrderDto,
    );
  }

  @Patch(':id')
  changeStatus(
    @Param('id') id: string,
    @Body() patchSpeditionOrderDto: PatchSpeditionOrderDto,
    @User() user: KnownUser,
  ) {
    if (this.isStatusPatch(patchSpeditionOrderDto)) {
      this.logger.log(
        `Called patch status spedition-orders endpoint (id: ${id})`,
      );

      return this.speditionOrdersService.changeStatus(
        id,
        user.companyId,
        patchSpeditionOrderDto.status,
      );
    }

    if (this.isOrderIdPatch(patchSpeditionOrderDto)) {
      this.logger.log(
        `Called patch orderId spedition-orders endpoint (id: ${id})`,
      );

      return this.speditionOrdersService.changeOrderId(
        id,
        user.companyId,
        patchSpeditionOrderDto.orderId,
      );
    }

    this.logger.log(
      `[BUG from frontend] Called unknown patch spedition-orders endpoint (id: ${id})`,
    );

    return null; // TODO add error to return 400
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

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: KnownUser) {
    this.logger.log('Called remove spedition-orders endpoint');
    await this.speditionOrdersService.remove(id, user.companyId);
  }
}
