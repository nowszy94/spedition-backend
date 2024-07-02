import { UnprocessableEntityException } from '@nestjs/common';

export class ContractorForUpdateSpeditionOrderNotExist extends UnprocessableEntityException {
  constructor(contractorId: string) {
    super(`contractor with id ${contractorId} does not exist`);
  }
}
