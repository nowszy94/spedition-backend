import { Injectable } from '@nestjs/common';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { ContractorsRepository } from './contractors-repository.port';
import { DynamoDBContractorsRepository } from '../../infra/dynamodb/contractors/contractors.repository';
import { COMPANY_ID } from '../../const';

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

  async findAll() {
    return await this.contractorsRepository.findAllContractors(COMPANY_ID);
  }

  async findOne(contractorId: string) {
    return await this.contractorsRepository.findContractor(
      COMPANY_ID,
      contractorId,
    );
  }

  async update(id: string, updateContractorDto: UpdateContractorDto) {
    return await this.contractorsRepository.updateContractor(
      updateContractorDto,
    );
  }

  async remove(id: string) {
    await this.contractorsRepository.deleteContractor(COMPANY_ID, id);
  }
}
