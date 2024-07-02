import { UnprocessableEntityException } from '@nestjs/common';

export class ContractorContactForUpdateSpeditionOrderNotExist extends UnprocessableEntityException {
  constructor(contractorId: string, contactId: string) {
    super(
      `contact with id ${contactId} does not exist on contractor with id ${contractorId}`,
    );
  }
}
