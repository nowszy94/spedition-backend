import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SpeditionOrdersService } from './spedition-orders.service';
import { CreateSpeditionOrderDto } from './dto/create-spedition-order.dto';
import { UpdateSpeditionOrderDto } from './dto/update-spedition-order.dto';

@Controller('spedition-orders')
export class SpeditionOrdersController {
  constructor(
    private readonly speditionOrdersService: SpeditionOrdersService,
  ) {}

  @Post()
  create(@Body() createSpeditionOrderDto: CreateSpeditionOrderDto) {
    return this.speditionOrdersService.create(createSpeditionOrderDto);
  }

  @Get()
  findAll() {
    return this.speditionOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.speditionOrdersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpeditionOrderDto: UpdateSpeditionOrderDto,
  ) {
    return this.speditionOrdersService.update(id, updateSpeditionOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.speditionOrdersService.remove(id);
  }
}
