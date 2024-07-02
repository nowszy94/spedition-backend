import { Injectable } from '@nestjs/common';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { ContractorsRepository } from './contractors-repository.port';
import { DynamoDBContractorsRepository } from '../../infra/dynamodb/contractors/contractors.repository';
import { ContractorNotFoundException } from './errors/ContractorNotFoundException';

@Injectable()
export class ContractorsService {
  private readonly contractorsRepository: ContractorsRepository;

  constructor() {
    this.contractorsRepository = new DynamoDBContractorsRepository();
  }

  async create(createContractorDto: CreateContractorDto) {
    const newContractor = CreateContractorDto.toNewEntity(createContractorDto);

    await this.contractorsRepository.createContractor(newContractor);

    return newContractor.id;
  }

  async findAll(companyId: string) {
    return await this.contractorsRepository.findAllContractors(companyId);
  }

  async findOne(companyId: string, contractorId: string) {
    return await this.findContractorOrThrow(companyId, contractorId);
  }

  async update(
    companyId: string,
    contractorId: string,
    updateContractorDto: UpdateContractorDto,
  ) {
    const foundContractor = await this.findContractorOrThrow(
      companyId,
      contractorId,
    );

    return await this.contractorsRepository.updateContractor(
      companyId,
      contractorId,
      {
        ...updateContractorDto,
        id: foundContractor.id,
        companyId: foundContractor.companyId,
        blacklist: foundContractor.blacklist,
      },
    );
  }

  async remove(companyId: string, id: string) {
    await this.contractorsRepository.deleteContractor(companyId, id);
  }

  async changeBlacklist(
    companyId: string,
    contractorId: string,
    blacklist: boolean,
  ) {
    const foundContractor = await this.findContractorOrThrow(
      companyId,
      contractorId,
    );

    return await this.contractorsRepository.updateContractor(
      companyId,
      contractorId,
      {
        ...foundContractor,
        blacklist,
      },
    );
  }

  private async findContractorOrThrow(companyId: string, contractorId: string) {
    const contractor = await this.contractorsRepository.findContractorById(
      companyId,
      contractorId,
    );

    if (!contractor) {
      throw new ContractorNotFoundException(contractorId);
    }

    return contractor;
  }
}
