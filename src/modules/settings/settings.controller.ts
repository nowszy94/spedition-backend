import { Body, Controller, Get, Put } from '@nestjs/common';
import { Settings } from './entities/settings.entity';
import { mockSettings } from './settings-mock-data';

@Controller('settings')
export class SettingsController {
  private settings: Settings;

  constructor() {
    this.settings = mockSettings;
  }

  @Get()
  find() {
    return this.settings;
  }

  @Put()
  update(@Body() updatedSettings: Settings) {
    this.settings = updatedSettings;

    return updatedSettings;
  }
}
