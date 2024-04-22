import { Settings } from './entities/settings.entity';
import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { DynamoDBSettingsRepository } from '../../infra/dynamodb/settings/settings.repository';

@Injectable()
export class SettingsService {
  private readonly settingsRepository: SettingsRepository;

  constructor() {
    this.settingsRepository = new DynamoDBSettingsRepository();
  }

  async findAll(companyId: string) {
    return await this.settingsRepository.findAll(companyId);
  }

  async changePolicy(
    companyId: string,
    newPolicy: Settings['speditionOrderPolicy'],
  ) {
    await this.settingsRepository.updatePolicy(companyId, newPolicy);
  }
}
