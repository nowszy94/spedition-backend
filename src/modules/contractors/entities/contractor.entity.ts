export class Contractor {
  id: string;
  companyId: string;
  name: string;
  nip: string;
  phoneNumber: string;
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
