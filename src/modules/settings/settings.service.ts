import { Injectable } from '@nestjs/common';

import { Settings } from './entities/settings.entity';
import { SettingsRepository } from './settings.repository';
import { DynamoDBSettingsRepository } from '../../infra/dynamodb/settings/settings.repository';

@Injectable()
export class SettingsService {
  private readonly settingsRepository: SettingsRepository;

  constructor() {
    this.settingsRepository = new DynamoDBSettingsRepository();
  }

  async findAll(companyId: string) {
    return await this.settingsRepository.findById(companyId);
  }

  async changePolicy(
    companyId: string,
    newPolicy: Settings['speditionOrderPolicy'],
  ) {
    await this.settingsRepository.updatePolicy(companyId, newPolicy);
  }

  async changeCompanyDetails(
    companyId: string,
    companyDetails: Settings['companyDetails'],
  ) {
    await this.settingsRepository.updateCompanyDetails(
      companyId,
      companyDetails,
    );
  }

  async changeSpeditionOrderPdfConfig(
    companyId: string,
    speditionOrderPdfConfig: Settings['additionalPdfConfiguration'],
  ) {
    await this.settingsRepository.updateSpeditionOrderPdfConfig(
      companyId,
      speditionOrderPdfConfig,
    );
  }
}
