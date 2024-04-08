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
import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { COMPANY_ID } from '../../const';

@Controller('contractors')
export class ContractorsController {
  private readonly logger = new Logger(ContractorsController.name);

  constructor(private readonly contractorsService: ContractorsService) {}

  @Get()
  findAll() {
    this.logger.log('Called findAll contractors endpoint');

    return this.contractorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Called findOne contractors endpoint (id: ${id})`);

    return this.contractorsService.findOne(id);
  }

  @Post()
  create(@Body() createContractorDto: CreateContractorDto) {
    this.logger.log('Called create contractor endpoint');
    this.logger.log('');

    return this.contractorsService.create({
      ...createContractorDto,
      companyId: COMPANY_ID,
    });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractorDto: UpdateContractorDto,
  ) {
    return this.contractorsService.update(id, {
      ...updateContractorDto,
      companyId: COMPANY_ID,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.contractorsService.remove(id);
  }
}
