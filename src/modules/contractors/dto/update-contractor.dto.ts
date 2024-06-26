export class UpdateContractorDto {
  name: string;
  phoneNumber: string;
  nip: string;
  email: string;
  address: string;
  additionalInfo: string;
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  }>;
}
