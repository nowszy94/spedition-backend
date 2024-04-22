import { Settings } from '../entities/settings.entity';

export type PatchPolicySettingsDto = Pick<Settings, 'speditionOrderPolicy'>;

export type PatchSettingsDto = PatchPolicySettingsDto;
