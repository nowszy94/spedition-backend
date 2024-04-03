import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SpeditionOrdersService } from './spedition-orders.service';
import { CreateSpeditionOrderDto } from './dto/create-spedition-order.dto';
import { UpdateSpeditionOrderDto } from './dto/update-spedition-order.dto';
import { COMPANY_ID } from '../../const';

@Controller('spedition-orders')
export class SpeditionOrdersController {
  private readonly logger = new Logger(SpeditionOrdersController.name);
  constructor(
    private readonly speditionOrdersService: SpeditionOrdersService,
  ) {}

  @Post()
  create(@Body() createSpeditionOrderDto: CreateSpeditionOrderDto) {
    this.logger.log('Called create endpoint');
    return this.speditionOrdersService.create({
      ...createSpeditionOrderDto,
      companyId: COMPANY_ID,
    });
  }

  @Get()
  findAll() {
    this.logger.log('Called findAll endpoint');
    return this.speditionOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log('Called findOne endpoint');
    return this.speditionOrdersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpeditionOrderDto: UpdateSpeditionOrderDto,
  ) {
    this.logger.log('Called update endpoint');
    return this.speditionOrdersService.update(id, {
      ...updateSpeditionOrderDto,
      companyId: COMPANY_ID,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log('Called remove endpoint');
    this.speditionOrdersService.remove(id);
  }
}
