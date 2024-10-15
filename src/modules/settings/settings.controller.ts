import { Body, Controller, Get, Logger, Patch } from '@nestjs/common';

import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from '../users/entities/user.entity';
import {
  isCompanyDetailsPatch,
  isPdfConfigPatch,
  isPolicyPatch,
  PatchSettingsDto,
} from './dto/patch-settings.dto';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/settings.dto';

@Controller('settings')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);

  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async find(@UserDecorator() user: User): Promise<SettingsDto> {
    this.logger.debug(`Called get settings endpoint`);

    const settings = await this.settingsService.findAll(user.companyId);

    return {
      companyDetails: settings.companyDetails,
      speditionOrderPolicy: settings.speditionOrderPolicy,
      additionalPdfConfiguration: settings.additionalPdfConfiguration,
    };
  }

  @Patch()
  async update(
    @Body() updatedSettings: PatchSettingsDto,
    @UserDecorator() user: User,
  ) {
    this.logger.debug(`Called put settings endpoint`);

    if (isCompanyDetailsPatch(updatedSettings)) {
      await this.settingsService.changeCompanyDetails(
        user.companyId,
        updatedSettings.companyDetails,
      );
    }

    if (isPolicyPatch(updatedSettings)) {
      await this.settingsService.changePolicy(
        user.companyId,
        updatedSettings.speditionOrderPolicy,
      );
    }

    if (isPdfConfigPatch(updatedSettings)) {
      await this.settingsService.changeSpeditionOrderPdfConfig(
        user.companyId,
        updatedSettings.additionalPdfConfiguration,
      );
    }
  }
}
