import { DynamoDB } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

import { Item } from '../../base';
import { Settings } from '../../../../modules/settings/entities/settings.entity';
import tableName from '../../table-name';

export class DynamoDBPolicyDto extends Item {
  constructor(
    public companyId: string,
    public payments: string,
    public contractor: string,
    public driver: string,
  ) {
    super();
  }

  public get pk() {
    return `Company#${this.companyId}/Settings`;
  }

  get sk(): string {
    return `CompanyPolicy`;
  }

  static async findByCompanyId(
    dynamoDBClient: DynamoDB,
    companyId: string,
  ): Promise<Settings['speditionOrderPolicy']> {
    const response = await dynamoDBClient
      .getItem({
        TableName: tableName,
        Key: {
          PK: { S: `Company#${companyId}/Settings` },
          SK: { S: 'CompanyPolicy' },
        },
      })
      .promise();

    if (!response.Item) {
      return null;
    }

    return DynamoDBPolicyDto.fromItem(response.Item).toDomain();
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      companyId: { S: this.companyId },
      payments: { S: this.payments },
      contractor: { S: this.contractor },
      driver: { S: this.driver },
    };
  }

  static fromItem(policySettingsItem: AttributeMap): DynamoDBPolicyDto {
    return new DynamoDBPolicyDto(
      policySettingsItem.companyId.S,
      policySettingsItem.payments.S,
      policySettingsItem.contractor.S,
      policySettingsItem.driver.S,
    );
  }

  toDomain(): Settings['speditionOrderPolicy'] {
    return {
      payments: {
        name: 'Płatności',
        text: this.payments.split('\n'),
      },
      contractor: {
        name: 'Przewoźnik',
        text: this.contractor.split('\n'),
      },
      driver: {
        name: 'Kierowca',
        text: this.driver.split('\n'),
      },
    };
  }

  static fromDomain(
    companyId: string,
    settings: Settings['speditionOrderPolicy'],
  ): DynamoDBPolicyDto {
    return new DynamoDBPolicyDto(
      companyId,
      settings.payments.text.join('\n'),
      settings.contractor.text.join('\n'),
      settings.driver.text.join('\n'),
    );
  }
}
