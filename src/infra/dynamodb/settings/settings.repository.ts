import { DynamoDB } from 'aws-sdk';
import { SettingsRepository } from '../../../modules/settings/settings.repository';
import { Settings } from 'src/modules/settings/entities/settings.entity';
import { DynamoDBSettingsPolicyDto } from './settings.dto';

const DYNAMODB_TABLE_NAME = 'SpeditionInfrastructureStackDynamoTable';

export class DynamoDBSettingsRepository implements SettingsRepository {
  private readonly dynamoDB: DynamoDB;
  private readonly tableName = process.env.databaseTable || DYNAMODB_TABLE_NAME;

  constructor() {
    this.dynamoDB = new DynamoDB({
      region: process.env.region || 'eu-central-1',
    });
  }

  async findAll(companyId: string): Promise<Settings> {
    const response = await this.dynamoDB
      .getItem({
        TableName: this.tableName,
        Key: {
          PK: { S: `Company#${companyId}/Settings` },
          SK: { S: 'Policy' },
        },
      })
      .promise();

    if (!response.Item) {
      return null;
    }

    const settingsDto = DynamoDBSettingsPolicyDto.fromItem(response.Item);

    return settingsDto.toDomain();
  }

  async updatePolicy(
    companyId: string,
    updatedSettings: Settings['speditionOrderPolicy'],
  ): Promise<void> {
    const settingsDto = DynamoDBSettingsPolicyDto.fromDomain(
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
