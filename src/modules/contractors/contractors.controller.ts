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
import { User } from '../../auth/user.decorator';
import { KnownUser } from '../../auth/known-users.mock';

@Controller('contractors')
export class ContractorsController {
  private readonly logger = new Logger(ContractorsController.name);

  constructor(private readonly contractorsService: ContractorsService) {}

  @Get()
  findAll(@User() user: KnownUser) {
    this.logger.log('Called findAll contractors endpoint');

    return this.contractorsService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: KnownUser) {
    this.logger.log(`Called findOne contractors endpoint (id: ${id})`);

    return this.contractorsService.findOne(user.companyId, id);
  }

  @Post()
  create(
    @Body() createContractorDto: CreateContractorDto,
    @User() user: KnownUser,
  ) {
    this.logger.log('Called create contractor endpoint');

    return this.contractorsService.create({
      ...createContractorDto,
      companyId: user.companyId,
    });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractorDto: UpdateContractorDto,
    @User() user: KnownUser,
  ) {
    return this.contractorsService.update(
      user.companyId,
      id,
      updateContractorDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: KnownUser) {
    this.contractorsService.remove(user.companyId, id);
  }
}
