import { Injectable } from '@nestjs/common';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { ContractorsRepository } from './contractors-repository.port';
import { DynamoDBContractorsRepository } from '../../infra/dynamodb/contractors/contractors.repository';

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
    return await this.contractorsRepository.findContractorById(
      companyId,
      contractorId,
    );
  }

  async update(
    companyId: string,
    id: string,
    updateContractorDto: UpdateContractorDto,
  ) {
    return await this.contractorsRepository.updateContractor(
      companyId,
      id,
      updateContractorDto,
    );
  }

  async remove(companyId: string, id: string) {
    await this.contractorsRepository.deleteContractor(companyId, id);
  }
}
