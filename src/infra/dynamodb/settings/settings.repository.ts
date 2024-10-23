import { DynamoDB } from 'aws-sdk';

import { SettingsRepository } from '../../../modules/settings/settings.repository';
import { Settings } from 'src/modules/settings/entities/settings.entity';
import { DynamoDBCompanyDetailsDto } from './dto/settings-company-details.dto';
import { DynamoDBPdfConfigDto } from './dto/settings-pdf-config.dto';
import { DynamoDBSpeditionOrderPolicyDto } from './dto/spedition-order-policy.dto';

const DYNAMODB_TABLE_NAME = 'SpeditionInfrastructureStackDynamoTable';

export class DynamoDBSettingsRepository implements SettingsRepository {
  private readonly dynamoDB: DynamoDB;
  private readonly tableName = process.env.databaseTable || DYNAMODB_TABLE_NAME;

  constructor() {
    this.dynamoDB = new DynamoDB({
      region: process.env.region || 'eu-central-1',
    });
  }

  async findById(companyId: string): Promise<Settings> {
    const [policy, details, pdfConfig] = await Promise.all([
      DynamoDBSpeditionOrderPolicyDto.findByCompanyId(this.dynamoDB, companyId),
      DynamoDBCompanyDetailsDto.findByCompanyId(this.dynamoDB, companyId),
      DynamoDBPdfConfigDto.findByCompanyId(this.dynamoDB, companyId),
    ]);

    return {
      companyId,
      speditionOrderPolicy: policy,
      companyDetails: details,
      additionalPdfConfiguration: pdfConfig,
    };
  }

  async updateCompanyDetails(
    companyId: string,
    companyDetails: Settings['companyDetails'],
  ): Promise<void> {
    const companyDetailsDto = DynamoDBCompanyDetailsDto.fromDomain(
      companyId,
      companyDetails,
    );

    await this.dynamoDB
      .putItem({
        TableName: this.tableName,
        Item: companyDetailsDto.toItem(),
      })
      .promise();
  }

  async updateSpeditionOrderPdfConfig(
    companyId: string,
    speditionOrderPdfConfig: Settings['additionalPdfConfiguration'],
  ): Promise<void> {
    const speditionOrderPdfConfigDto = DynamoDBPdfConfigDto.fromDomain(
      companyId,
      speditionOrderPdfConfig,
    );

    await this.dynamoDB
      .putItem({
        TableName: this.tableName,
        Item: speditionOrderPdfConfigDto.toItem(),
      })
      .promise();
  }

  async updatePolicy(
    companyId: string,
    updatedPolicy: Settings['speditionOrderPolicy'],
  ): Promise<void> {
    const policyDto = DynamoDBSpeditionOrderPolicyDto.fromDomain(
      companyId,
      updatedPolicy,
    );

    await this.dynamoDB
      .putItem({
        TableName: this.tableName,
        Item: policyDto.toItem(),
      })
      .promise();
  }
}
