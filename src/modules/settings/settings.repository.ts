import { Settings } from './entities/settings.entity';

export interface SettingsRepository {
  findAll(companyId: string): Promise<Settings>;

  updatePolicy(
    companyId: string,
    updatedSettings: Settings['speditionOrderPolicy'],
  ): Promise<void>;
}
