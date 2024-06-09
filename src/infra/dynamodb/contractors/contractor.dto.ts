import { Item } from '../base';
import { Contractor } from '../../../modules/contractors/entities/contractor.entity';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

export class DynamoDBContractorDto extends Item {
  constructor(
    public id: string,
    public companyId: string,
    public name: string,
    public nip: string,
    public phoneNumber: string,
    public email: string,
    public address: string,
    public additionalInfo: string,
    public blacklist: boolean,
    public contacts: Array<{
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
    }>,
  ) {
    super();
  }
  public get pk() {
    return `Company#${this.companyId}/Contractor`;
  }

  public get sk() {
    return `Contractor#${this.id}`;
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      id: { S: this.id },
      name: { S: this.name },
      companyId: { S: this.companyId },
      nip: { S: this.nip },
      phoneNumber: { S: this.phoneNumber },
      email: { S: this.email },
      address: { S: this.address },
      additionalInfo: { S: this.additionalInfo },
      blacklist: { BOOL: this.blacklist },
      contacts: {
        L: this.contacts.map((contact) => ({
          M: {
            id: { S: contact.id },
            name: { S: contact.name },
            email: { S: contact.email },
            phoneNumber: { S: contact.phoneNumber },
          },
        })),
      },
    };
  }

  public toDomain = (): Contractor => ({
    id: this.id,
    companyId: this.companyId,
    name: this.name,
    nip: this.nip,
    phoneNumber: this.phoneNumber,
    email: this.email,
    address: this.address,
    blacklist: this.blacklist,
    additionalInfo: this.additionalInfo,
    contacts: this.contacts,
  });

  static fromDomain = (contractor: Contractor): DynamoDBContractorDto => {
    return new DynamoDBContractorDto(
      contractor.id,
      contractor.companyId,
      contractor.name,
      contractor.nip,
      contractor.phoneNumber,
      contractor.email,
      contractor.address,
      contractor.additionalInfo,
      contractor.blacklist,
      contractor.contacts,
    );
  };

  static fromItem = (contractorItem: AttributeMap): DynamoDBContractorDto => {
    return new DynamoDBContractorDto(
      contractorItem.id.S,
      contractorItem.companyId.S,
      contractorItem.name.S,
      contractorItem.nip.S,
      contractorItem.phoneNumber.S,
      contractorItem.email.S,
      contractorItem.address.S,
      contractorItem.additionalInfo.S,
      contractorItem.blacklist?.BOOL || false,
      contractorItem.contacts.L.map((contact) => ({
        id: contact.M.id.S,
        name: contact.M.name.S,
        email: contact.M.email.S,
        phoneNumber: contact.M.phoneNumber.S,
      })),
    );
  };
}
