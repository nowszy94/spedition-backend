import { DynamoDB } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

import { Item } from '../../base';
import { Settings } from '../../../../modules/settings/entities/settings.entity';
import tableName from '../../table-name';

export class DynamoDBCompanyDetailsDto extends Item {
  constructor(
    public companyId: string,
    public name: string,
    public nip: string,
    public address: string,
    public email: string,
    public phoneNumber: string,
  ) {
    super();
  }

  public get pk() {
    return `Company#${this.companyId}/Settings`;
  }

  get sk(): string {
    return `CompanyDetails`;
  }

  static async findByCompanyId(
    dynamoDBClient: DynamoDB,
    companyId: string,
  ): Promise<Settings['companyDetails']> {
    const response = await dynamoDBClient
      .getItem({
        TableName: tableName,
        Key: {
          PK: { S: `Company#${companyId}/Settings` },
          SK: { S: 'CompanyDetails' },
        },
      })
      .promise();

    if (!response.Item) {
      return null;
    }

    return DynamoDBCompanyDetailsDto.fromItem(response.Item).toDomain();
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      companyId: { S: this.companyId },
      name: { S: this.name },
      nip: { S: this.nip },
      address: { S: this.address },
      email: { S: this.email },
      phoneNumber: { S: this.phoneNumber },
    };
  }

  static fromItem(
    companyDetailsSettingsItem: AttributeMap,
  ): DynamoDBCompanyDetailsDto {
    return new DynamoDBCompanyDetailsDto(
      companyDetailsSettingsItem.companyId.S,
      companyDetailsSettingsItem.name.S,
      companyDetailsSettingsItem.nip.S,
      companyDetailsSettingsItem.address.S,
      companyDetailsSettingsItem.email.S,
      companyDetailsSettingsItem.phoneNumber.S,
    );
  }

  toDomain(): Settings['companyDetails'] {
    return {
      name: this.name,
      nip: this.nip,
      address: this.address,
      email: this.email,
      phoneNumber: this.phoneNumber,
    };
  }

  static fromDomain(
    companyId: string,
    settings: Settings['companyDetails'],
  ): DynamoDBCompanyDetailsDto {
    return new DynamoDBCompanyDetailsDto(
      companyId,
      settings.name,
      settings.nip,
      settings.address,
      settings.email,
      settings.phoneNumber,
    );
  }
}
