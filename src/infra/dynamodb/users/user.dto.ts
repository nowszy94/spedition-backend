import { Item } from '../base';
import { User } from '../../../modules/users/entities/user.entity';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

export class DynamoDBUserDto extends Item {
  constructor(
    public sub: string,
    public companyId: string,
    public firstName: string,
    public lastname: string,
    public email: string,
    public phoneNumber: string,
  ) {
    super();
  }

  public get pk(): string {
    return `Company#${this.companyId}/User#${this.sub}`;
  }

  public get sk(): string {
    return `User#${this.sub}`;
  }

  private gsiKeys(): Record<string, unknown> {
    return {
      GSI1PK: { S: `User#${this.sub}` },
      GSI1SK: { S: `User#${this.sub}` },
    };
  }

  public toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      ...this.gsiKeys(),
      sub: { S: this.sub },
      companyId: { S: this.companyId },
      firstName: { S: this.firstName },
      lastname: { S: this.lastname },
      email: { S: this.email },
      phoneNumber: { S: this.phoneNumber },
    };
  }

  public toDomain = (): User =>
    new User(
      this.sub,
      this.companyId,
      this.firstName,
      this.lastname,
      this.email,
      this.phoneNumber,
    );

  static fromDomain = (user: User): DynamoDBUserDto => {
    return new DynamoDBUserDto(
      user.sub,
      user.companyId,
      user.firstName,
      user.lastname,
      user.email,
      user.phoneNumber,
    );
  };

  static fromItem = (userItem: AttributeMap): DynamoDBUserDto => {
    return new DynamoDBUserDto(
      userItem.sub.S,
      userItem.companyId.S,
      userItem.firstName.S,
      userItem.lastname.S,
      userItem.email.S,
      userItem.phoneNumber.S,
    );
  };
}
