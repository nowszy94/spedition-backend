import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // this is used by LB as a health-check
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
