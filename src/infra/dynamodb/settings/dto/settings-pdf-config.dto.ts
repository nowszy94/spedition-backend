import { DynamoDB } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

import { Item } from '../../base';
import { Settings } from '../../../../modules/settings/entities/settings.entity';
import tableName from '../../table-name';

export class DynamoDBPdfConfigDto extends Item {
  constructor(
    public companyId: string,
    public paymentAnnotation: string,
    public paymentDaysAnnotation: string,
  ) {
    super();
  }

  public get pk() {
    return `Company#${this.companyId}/Settings`;
  }

  get sk(): string {
    return `CompanyPdfConfig`;
  }

  static async findByCompanyId(
    dynamoDBClient: DynamoDB,
    companyId: string,
  ): Promise<Settings['additionalPdfConfiguration']> {
    const response = await dynamoDBClient
      .getItem({
        TableName: tableName,
        Key: {
          PK: { S: `Company#${companyId}/Settings` },
          SK: { S: 'CompanyPdfConfig' },
        },
      })
      .promise();

    if (!response.Item) {
      return null;
    }

    return DynamoDBPdfConfigDto.fromItem(response.Item).toDomain();
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      companyId: { S: this.companyId },
      paymentAnnotation: { S: this.paymentAnnotation },
      paymentDaysAnnotation: { S: this.paymentDaysAnnotation },
    };
  }

  static fromItem(policySettingsItem: AttributeMap): DynamoDBPdfConfigDto {
    return new DynamoDBPdfConfigDto(
      policySettingsItem.companyId.S,
      policySettingsItem.paymentAnnotation.S,
      policySettingsItem.paymentDaysAnnotation.S,
    );
  }

  toDomain(): Settings['additionalPdfConfiguration'] {
    return {
      paymentAnnotation: this.paymentAnnotation,
      paymentDaysAnnotation: this.paymentDaysAnnotation,
    };
  }

  static fromDomain(
    companyId: string,
    settings: Settings['additionalPdfConfiguration'],
  ): DynamoDBPdfConfigDto {
    return new DynamoDBPdfConfigDto(
      companyId,
      settings.paymentAnnotation,
      settings.paymentDaysAnnotation,
    );
  }
}
