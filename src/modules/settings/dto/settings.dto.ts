import { Settings } from '../entities/settings.entity';

export type SettingsDto = Omit<Settings, 'companyId'>;
