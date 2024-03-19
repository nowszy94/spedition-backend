import { v4 as uuidv4 } from 'uuid';

import { Contractor } from '../entities/contractor.entity';

export class CreateContractorDto {
  name: string;
  nip: string;
  phoneNumber: string;
  email: string;
  address: string;
  additionalInfo: string;
  contacts: Array<{
    name: string;
    email: string;
    phoneNumber: string;
  }>;

  static toNewEntity = (dto: CreateContractorDto): Contractor => ({
    ...dto,
    id: uuidv4(),
    contacts: dto.contacts.map((dtoContact) => ({
      ...dtoContact,
      id: uuidv4(),
    })),
  });
}
