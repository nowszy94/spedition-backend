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
import { COMPANY_ID } from '../../const';
import { PatchSpeditionOrderDto } from './dto/patch-spedition-order.dto';

@Controller('spedition-orders')
export class SpeditionOrdersController {
  private readonly logger = new Logger(SpeditionOrdersController.name);

  constructor(
    private readonly speditionOrdersService: SpeditionOrdersService,
  ) {}

  @Get()
  findAll() {
    this.logger.log('Called findAll spedition-orders endpoint');
    return this.speditionOrdersService.findAll(COMPANY_ID);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log('Called findOne spedition-orders endpoint');
    return this.speditionOrdersService.findOne(id, COMPANY_ID);
  }

  @Post()
  create(
    @Body() createSpeditionOrderDto: CreateSpeditionOrderDto,
    @Query('status') status: string,
  ) {
    this.logger.log('Called create spedition-orders endpoint');

    if (status === 'DRAFT') {
      return this.speditionOrdersService.createDraftSpeditionOrder(
        COMPANY_ID,
        createSpeditionOrderDto,
      );
    }

    return this.speditionOrdersService.createActiveSpeditionOrder(
      COMPANY_ID,
      createSpeditionOrderDto,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpeditionOrderDto: UpdateSpeditionOrderDto,
  ) {
    this.logger.log('Called update spedition-orders endpoint');

    return this.speditionOrdersService.update(
      id,
      COMPANY_ID,
      updateSpeditionOrderDto,
    );
  }

  @Patch(':id')
  changeStatus(
    @Param('id') id: string,
    @Body() patchSpeditionOrderDto: PatchSpeditionOrderDto,
  ) {
    this.logger.log('Called patch spedition-orders endpoint');

    return this.speditionOrdersService.changeStatus(
      id,
      COMPANY_ID,
      patchSpeditionOrderDto.status,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log('Called remove spedition-orders endpoint');
    await this.speditionOrdersService.remove(id, COMPANY_ID);
  }
}
