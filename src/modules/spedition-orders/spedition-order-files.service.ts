import moment from 'moment';
import { Injectable } from '@nestjs/common';

import { SpeditionOrdersRepository } from './ports/spedition-orders.repository';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/dynamodb-spedition-order.repository';
import { SpeditionOrderFilesRepository } from './ports/spedition-order-files.repository';
import { S3SpeditionOrderFilesRepository } from '../../infra/s3/spedition-orders/s3-spedition-order-files.repository';
import { SpeditionOrderFileEntity } from './entities/spedition-order-file.entity';
import { SpeditionOrderNotFoundException } from './errors/SpeditionOrderNotFoundException';

@Injectable()
export class SpeditionOrderFilesService {
  private readonly speditionOrderRepository: SpeditionOrdersRepository;
  private readonly speditionOrderFilesRepository: SpeditionOrderFilesRepository;

  constructor() {
    this.speditionOrderRepository = new DynamoDBSpeditionOrderRepository();
    this.speditionOrderFilesRepository = new S3SpeditionOrderFilesRepository();
  }

  async uploadFiles(
    companyId: string,
    speditionOrderId: string,
    files: Array<Express.Multer.File>,
  ) {
    await this.findSpeditionOrderOrThrow(companyId, speditionOrderId);

    return this.speditionOrderFilesRepository.addFiles(
      companyId,
      speditionOrderId,
      files,
    );
  }

  async listFilesBySpeditionOrderId(
    companyId: string,
    speditionOrderId: string,
  ): Promise<Array<SpeditionOrderFileEntity>> {
    await this.findSpeditionOrderOrThrow(companyId, speditionOrderId);

    const result =
      await this.speditionOrderFilesRepository.listFilesBySpeditionOrderId(
        companyId,
        speditionOrderId,
      );

    return result.sort((a, b) => {
      const aDate = moment(a.lastModified);
      const bDate = moment(b.lastModified);

      return bDate.diff(aDate);
    });
  }

  async getSpeditionOrderFile(
    companyId: string,
    speditionOrderId: string,
    filename: string,
  ) {
    await this.findSpeditionOrderOrThrow(companyId, speditionOrderId);

    return this.speditionOrderFilesRepository.getFileByFilename(
      companyId,
      speditionOrderId,
      filename,
    );
  }

  async getSpeditionOrderFilePresignedUrl(
    companyId: string,
    speditionOrderId: string,
    filename: string,
  ): Promise<string> {
    await this.findSpeditionOrderOrThrow(companyId, speditionOrderId);

    return this.speditionOrderFilesRepository.getFilePresignedUrlByFilename(
      companyId,
      speditionOrderId,
      filename,
    );
  }

  async removeSpeditionOrderFile(
    companyId: string,
    speditionOrderId: string,
    filename: string,
  ) {
    await this.findSpeditionOrderOrThrow(companyId, speditionOrderId);

    return this.speditionOrderFilesRepository.removeFile(
      companyId,
      speditionOrderId,
      filename,
    );
  }

  private async findSpeditionOrderOrThrow(
    companyId: string,
    speditionOrderId: string,
  ) {
    const contractor = await this.speditionOrderRepository.findById(
      companyId,
      speditionOrderId,
    );
    if (!contractor) {
      throw new SpeditionOrderNotFoundException(speditionOrderId);
    }
    return contractor;
  }
}
