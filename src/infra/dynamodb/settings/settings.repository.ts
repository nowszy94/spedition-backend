import { DynamoDB } from 'aws-sdk';
import { SettingsRepository } from '../../../modules/settings/settings.repository';
import { Settings } from 'src/modules/settings/entities/settings.entity';
import { DynamoDBPolicyDto } from './dto/settings-policy.dto';
import { DynamoDBCompanyDetailsDto } from './dto/settings-company-details.dto';
import { DynamoDBPdfConfigDto } from './dto/settings-pdf-config.dto';

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
      DynamoDBPolicyDto.findByCompanyId(this.dynamoDB, companyId),
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

  async updatePolicy(
    companyId: string,
    updatedSettings: Settings['speditionOrderPolicy'],
  ): Promise<void> {
    const settingsDto = DynamoDBPolicyDto.fromDomain(
      companyId,
      updatedSettings,
    );

    await this.dynamoDB
      .putItem({
        TableName: this.tableName,
        Item: settingsDto.toItem(),
      })
      .promise();
  }
}
