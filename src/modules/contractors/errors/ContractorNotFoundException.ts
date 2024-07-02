import { NotFoundException } from '@nestjs/common';

export class ContractorNotFoundException extends NotFoundException {
  constructor(contractorId: string) {
    super(`Contractor with id ${contractorId} not found`);
  }
}
