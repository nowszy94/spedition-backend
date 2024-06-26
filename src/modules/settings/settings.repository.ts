import { Settings } from './entities/settings.entity';

export interface SettingsRepository {
  findById(companyId: string): Promise<Settings>;

  updatePolicy(
    companyId: string,
    updatedSettings: Settings['speditionOrderPolicy'],
  ): Promise<void>;
}
