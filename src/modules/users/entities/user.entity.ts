import { SpeditionOrder } from '../../spedition-orders/entities/spedition-order.entity';

export class User {
  sub: string;
  companyId: string;
  firstName: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  preferredOrderIdSuffix: string;

  constructor(
    sub: string,
    companyId: string,
    firstName: string,
    lastname: string,
    email: string,
    phoneNumber: string,
    preferredOrderIdSuffix: string,
  ) {
    this.sub = sub;
    this.companyId = companyId;
    this.firstName = firstName;
    this.lastname = lastname;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.preferredOrderIdSuffix = preferredOrderIdSuffix;
  }

  toCreator = (): SpeditionOrder['creator'] => ({
    id: this.sub,
    name: `${this.firstName} ${this.lastname}`,
    email: this.email,
    phoneNumber: this.phoneNumber,
  });
}
