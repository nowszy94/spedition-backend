import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Readable } from 'stream';
import { FilesInterceptor } from '@nestjs/platform-express';

import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from '../users/entities/user.entity';
import { SpeditionOrderFilesService } from './spedition-order-files.service';

@Controller('spedition-orders/:id/files')
export class SpeditionOrderFilesController {
  private readonly logger = new Logger(SpeditionOrderFilesController.name);

  constructor(
    private readonly speditionOrderFilesService: SpeditionOrderFilesService,
  ) {}

  @Get('')
  async listFilesBySpeditionOrderId(
    @Param('id') speditionOrderId: string,
    @UserDecorator() user: User,
  ) {
    this.logger.debug(
      `Called list files of spedition order(${speditionOrderId}) endpoint`,
    );

    return this.speditionOrderFilesService.listFilesBySpeditionOrderId(
      user.companyId,
      speditionOrderId,
    );
  }

  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @Param('id') speditionOrderId: string,
    @UserDecorator() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    this.logger.debug(
      `Called add files(${files.length}) to spedition order endpoint`,
    );

    await this.speditionOrderFilesService.uploadFiles(
      user.companyId,
      speditionOrderId,
      files,
    );
  }

  @Get('/:filename')
  async getSpeditionOrderFile(
    @Param('id') speditionOrderId: string,
    @Param('filename') filename: string,
    @UserDecorator() user: User,
    @Res() res: Response,
  ) {
    this.logger.debug(
      `Called get file(${filename}) of spedition order(${speditionOrderId}) endpoint`,
    );

    const file = await this.speditionOrderFilesService.getSpeditionOrderFile(
      user.companyId,
      speditionOrderId,
      filename,
    );

    const nodeStream = new Readable().wrap(file);
    // @ts-ignore
    nodeStream.pipe(res);
  }

  @Delete('/:filename')
  async deleteFile(
    @Param('id') speditionOrderId: string,
    @Param('filename') filename: string,
    @UserDecorator() user: User,
  ) {
    this.logger.debug(
      `Called remove file(${filename}) of speditionOrder(${speditionOrderId}) spedition order endpoint`,
    );

    await this.speditionOrderFilesService.removeSpeditionOrderFile(
      user.companyId,
      speditionOrderId,
      filename,
    );
  }

  @Get('/:filename/presigned-url')
  async getSpeditionOrderFilePresignedUrl(
    @Param('id') speditionOrderId: string,
    @Param('filename') filename: string,
    @UserDecorator() user: User,
  ) {
    this.logger.debug(
      `Called get presigned url for file(${filename}) of spedition order(${speditionOrderId}) endpoint`,
    );

    const filePresignedUrl =
      await this.speditionOrderFilesService.getSpeditionOrderFilePresignedUrl(
        user.companyId,
        speditionOrderId,
        filename,
      );

    return {
      url: filePresignedUrl,
    };
  }
}
