import {
  Controller,
  Get,
  Logger,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from '../users/entities/user.entity';
import { CompanyLogoService } from './company-logo.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('company-logo')
export class CompanyLogoController {
  private readonly logger = new Logger(CompanyLogoController.name);

  constructor(private readonly companyLogoService: CompanyLogoService) {}

  @Get()
  async findCompanyLogo(@UserDecorator() user: User, @Res() res: Response) {
    this.logger.debug(`Called get company logo endpoint`);

    const result = await this.companyLogoService.findCompanyLogo(
      user.companyId,
    );

    res.set({
      'Content-Type': result.contentType,
      'Content-Length': result.contentLength,
    });

    await result.body.pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
        abort(err) {
          this.logger.error('Streaming aborted due to an error:', err);
          res.status(500).send('Error while loading image');
        },
      }),
    );

    return res;
  }

  @Post()
  @UseInterceptors(FileInterceptor('companyLogo'))
  async uploadCompanyLogo(
    @UserDecorator() user: User,
    @UploadedFile() companyLogo: Express.Multer.File,
  ) {
    this.logger.debug(
      `Called post company logo endpoint to company ${user.companyId}`,
    );

    await this.companyLogoService.uploadCompanyLogo(
      user.companyId,
      companyLogo,
    );
  }
}
