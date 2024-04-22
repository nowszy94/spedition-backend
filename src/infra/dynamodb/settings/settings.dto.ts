import { Item } from '../base';
import { Settings } from '../../../modules/settings/entities/settings.entity';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

export class DynamoDBSettingsPolicyDto extends Item {
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
    return `Policy`;
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

  static fromItem(policySettingsItem: AttributeMap): DynamoDBSettingsPolicyDto {
    return new DynamoDBSettingsPolicyDto(
      policySettingsItem.companyId.S,
      policySettingsItem.payments.S,
      policySettingsItem.contractor.S,
      policySettingsItem.driver.S,
    );
  }

  toDomain(): Settings {
    return {
      companyId: this.companyId,
      speditionOrderPolicy: {
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
      },
    };
  }

  static fromDomain(
    companyId: string,
    settings: Settings['speditionOrderPolicy'],
  ): DynamoDBSettingsPolicyDto {
    return new DynamoDBSettingsPolicyDto(
      companyId,
      settings.payments.text.join('\n'),
      settings.contractor.text.join('\n'),
      settings.driver.text.join('\n'),
    );
  }
}
