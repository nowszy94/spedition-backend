export class Contractor {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  additionalInfo: string;
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  }>;
}
