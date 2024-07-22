import { UnprocessableEntityException } from '@nestjs/common';

export class CreatorNotFoundException extends UnprocessableEntityException {
  constructor(companyId: string, creatorId: string) {
    super(
      `user with id ${creatorId} does not exist on company with id ${companyId}`,
    );
  }
}
