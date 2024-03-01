import { Injectable } from '@nestjs/common';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { Contractor } from './entities/contractor.entity';
import { contractors } from './contractors-mock-data';

@Injectable()
export class ContractorsService {
  private contractorsData: Array<Contractor>;
  constructor() {
    this.contractorsData = contractors;
  }
  create(createContractorDto: CreateContractorDto) {
    const newContractor = CreateContractorDto.toNewEntity(createContractorDto);

    this.contractorsData.push(newContractor);

    return newContractor.id;
  }

  findAll() {
    return this.contractorsData;
  }

  findOne(id: string) {
    return this.contractorsData.find((contractor) => contractor.id === id);
  }

  update(id: string, updateContractorDto: UpdateContractorDto) {
    this.contractorsData = this.contractorsData.map((contractor) => {
      if (contractor.id !== id) {
        return contractor;
      }
      return updateContractorDto;
    });

    return updateContractorDto;
  }

  remove(id: string) {
    this.contractorsData = this.contractorsData.filter(
      (contractor) => contractor.id !== id,
    );
  }
}
