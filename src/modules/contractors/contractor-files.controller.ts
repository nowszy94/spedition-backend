import { Readable } from 'stream';
import { Controller, Delete, Get, Logger, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from '../users/entities/user.entity';
import { ContractorFilesService } from './contractor-files.service';

@Controller('contractors/:id/files')
export class ContractorFilesController {
  private readonly logger = new Logger(ContractorFilesController.name);

  constructor(
    private readonly contractorFilesService: ContractorFilesService,
  ) {}

  @Get('')
  async listFilesByContractorId(
    @Param('id') contractorId: string,
    @UserDecorator() user: User,
  ) {
    this.logger.debug(
      `Called list files of contractor(${contractorId}) endpoint`,
    );

    return this.contractorFilesService.listFilesByContractorId(
      user.companyId,
      contractorId,
    );
  }

  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @Param('id') contractorId: string,
    @UserDecorator() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    this.logger.debug(
      `Called add files(${files.length}) to contractor(${contractorId}) endpoint`,
    );

    await this.contractorFilesService.uploadFiles(
      user.companyId,
      contractorId,
      files,
    );
  }

  @Get('/:filename')
  async getContractorFile(
    @Param('id') contractorId: string,
    @Param('filename') filename: string,
    @UserDecorator() user: User,
    @Res() res: Response,
  ) {
    this.logger.debug(
      `Called get file(${filename}) of contractor(${contractorId}) endpoint`,
    );

    const file = await this.contractorFilesService.getContractorFile(
      user.companyId,
      contractorId,
      filename,
    );

    const nodeStream = new Readable().wrap(file);
    // @ts-ignore
    nodeStream.pipe(res);
  }

  @Delete('/:filename')
  async deleteFile(
    @Param('id') contractorId: string,
    @Param('filename') filename: string,
    @UserDecorator() user: User,
  ) {
    this.logger.debug(
      `Called remove file(${filename}) of contractor(${contractorId}) contractor endpoint`,
    );

    await this.contractorFilesService.removeContractorFile(
      user.companyId,
      contractorId,
      filename,
    );
  }

  @Get('/:filename/presigned-url')
  async getContractorFilePresignedUrl(
    @Param('id') contractorId: string,
    @Param('filename') filename: string,
    @UserDecorator() user: User,
  ) {
    this.logger.debug(
      `Called get presigned url for file(${filename}) of contractor(${contractorId}) endpoint`,
    );

    const filePresignedUrl =
      await this.contractorFilesService.getContractorFilePresignedUrl(
        user.companyId,
        contractorId,
        filename,
      );

    return {
      url: filePresignedUrl,
    };
  }
}