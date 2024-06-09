import { ulid } from 'ulid';
import { Contractor } from '../entities/contractor.entity';

export class CreateContractorDto {
  companyId: string;
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
    id: ulid(),
    contacts: dto.contacts.map((dtoContact) => ({
      ...dtoContact,
      id: ulid(),
    })),
    blacklist: false,
  });
}
