import { Settings } from './entities/settings.entity';

export interface SettingsRepository {
  findById(companyId: string): Promise<Settings>;

  updateCompanyDetails(
    companyId: string,
    companyDetails: Settings['companyDetails'],
  ): Promise<void>;

  updatePolicy(
    companyId: string,
    updatedSettings: Settings['speditionOrderPolicy'],
  ): Promise<void>;

  updateSpeditionOrderPdfConfig(
    companyId: string,
    speditionOrderPdfConfig: Settings['additionalPdfConfiguration'],
  ): Promise<void>;
}
