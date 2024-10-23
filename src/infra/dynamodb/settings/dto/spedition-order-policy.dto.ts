import { DynamoDB } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

import { Item } from '../../base';
import { Settings } from '../../../../modules/settings/entities/settings.entity';
import tableName from '../../table-name';

export class DynamoDBSpeditionOrderPolicyDto extends Item {
  constructor(
    public companyId: string,
    public policies: Array<{
      name: string;
      value: string;
    }>,
  ) {
    super();
  }

  public get pk() {
    return `Company#${this.companyId}/Settings`;
  }

  get sk(): string {
    return `SpeditionOrderPolicy`;
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
          SK: { S: 'SpeditionOrderPolicy' },
        },
      })
      .promise();

    if (!response.Item) {
      return null;
    }

    return DynamoDBSpeditionOrderPolicyDto.fromItem(response.Item).toDomain();
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      companyId: { S: this.companyId },
      policies: {
        L: this.policies.map((policy) => ({
          M: {
            name: { S: policy.name },
            value: { S: policy.value },
          },
        })),
      },
    };
  }

  static fromItem(
    policySettingsItem: AttributeMap,
  ): DynamoDBSpeditionOrderPolicyDto {
    return new DynamoDBSpeditionOrderPolicyDto(
      policySettingsItem.companyId.S,
      policySettingsItem.policies.L.map((policyItem) => ({
        name: policyItem.M.name.S,
        value: policyItem.M.value.S,
      })),
    );
  }

  toDomain(): Settings['speditionOrderPolicy'] {
    return this.policies;
  }

  static fromDomain(
    companyId: string,
    settings: Settings['speditionOrderPolicy'],
  ): DynamoDBSpeditionOrderPolicyDto {
    return new DynamoDBSpeditionOrderPolicyDto(companyId, settings);
  }
}
