import { Settings } from '../entities/settings.entity';

export type PatchPolicySettingsDto = Pick<Settings, 'speditionOrderPolicy'>;
export type PatchCompanyDetailsDto = Pick<Settings, 'companyDetails'>;
export type PatchPdfConfigDto = Pick<Settings, 'additionalPdfConfiguration'>;

export type PatchSettingsDto =
  | PatchPolicySettingsDto
  | PatchCompanyDetailsDto
  | PatchPdfConfigDto;

export const isPolicyPatch = (
  dto: PatchSettingsDto,
): dto is PatchPolicySettingsDto => {
  return 'speditionOrderPolicy' in dto;
};

export const isCompanyDetailsPatch = (
  dto: PatchSettingsDto,
): dto is PatchCompanyDetailsDto => {
  return 'companyDetails' in dto;
};

export const isPdfConfigPatch = (
  dto: PatchSettingsDto,
): dto is PatchPdfConfigDto => {
  return 'additionalPdfConfiguration' in dto;
};
