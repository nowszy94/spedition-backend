import { Body, Controller, Get, Logger, Put } from '@nestjs/common';
import { Settings } from './entities/settings.entity';
import { mockSettings } from './settings-mock-data';

@Controller('settings')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);

  private settings: Settings;

  constructor() {
    this.settings = mockSettings;
  }

  @Get()
  find() {
    this.logger.debug(`Called get settings endpoint`);
    return this.settings;
  }

  @Put()
  update(@Body() updatedSettings: Settings) {
    this.logger.debug(`Called put settings endpoint`);

    this.settings = updatedSettings;

    return updatedSettings;
  }
}
