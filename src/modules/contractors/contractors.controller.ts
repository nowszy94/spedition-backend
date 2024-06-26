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
} from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from '../users/entities/user.entity';
import {
  PatchContractorBlacklistDto,
  PatchContractorDto,
} from './dto/patch-contractor.dto';

@Controller('contractors')
export class ContractorsController {
  private readonly logger = new Logger(ContractorsController.name);

  constructor(private readonly contractorsService: ContractorsService) {}

  @Get()
  findAll(@UserDecorator() user: User) {
    this.logger.debug('Called findAll contractors endpoint');

    return this.contractorsService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserDecorator() user: User) {
    this.logger.debug(`Called findOne contractors endpoint (id: ${id})`);

    return this.contractorsService.findOne(user.companyId, id);
  }

  @Post()
  create(
    @Body() createContractorDto: CreateContractorDto,
    @UserDecorator() user: User,
  ) {
    this.logger.debug('Called create contractor endpoint');

    return this.contractorsService.create({
      ...createContractorDto,
      companyId: user.companyId,
    });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractorDto: UpdateContractorDto,
    @UserDecorator() user: User,
  ) {
    return this.contractorsService.update(
      user.companyId,
      id,
      updateContractorDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserDecorator() user: User) {
    this.contractorsService.remove(user.companyId, id);
  }

  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() patchContractorDto: PatchContractorDto,
    @UserDecorator() user: User,
  ) {
    if (this.isBlacklistPatch(patchContractorDto)) {
      this.logger.debug(
        `Called patch blacklist contractor endpoint (id: ${id})`,
      );

      return this.contractorsService.changeBlacklist(
        user.companyId,
        id,
        patchContractorDto.blacklist,
      );
    }

    this.logger.debug(
      `[BUG from frontend] Called unknown patch contractor endpoint (id: ${id})`,
    );

    return null; // TODO add error to return 400
  }

  private isBlacklistPatch = (
    dto: PatchContractorDto,
  ): dto is PatchContractorBlacklistDto => {
    return 'blacklist' in dto;
  };
}
