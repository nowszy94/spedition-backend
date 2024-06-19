import * as moment from 'moment';
import { Injectable } from '@nestjs/common';

import { SpeditionOrdersRepository } from './spedition-orders.repository';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/dynamodb-spedition-order.repository';
import { SpeditionOrderFilesRepository } from './spedition-order-files.repository';
import { S3SpeditionOrderFilesRepository } from '../../infra/s3/spedition-orders/s3-spedition-order-files.repository';
import { SpeditionOrderFileEntity } from './entities/spedition-order-file.entity';

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
    const speditionOrder = await this.speditionOrderRepository.findById(
      companyId,
      speditionOrderId,
    );
    if (!speditionOrder) {
      return null;
    }

    await this.speditionOrderFilesRepository.addFiles(
      companyId,
      speditionOrderId,
      files,
    );
  }

  async listFilesBySpeditionOrderId(
    companyId: string,
    speditionOrderId: string,
  ): Promise<Array<SpeditionOrderFileEntity>> {
    const speditionOrder = await this.speditionOrderRepository.findById(
      companyId,
      speditionOrderId,
    );
    if (!speditionOrder) {
      return null;
    }

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
    const speditionOrder = await this.speditionOrderRepository.findById(
      companyId,
      speditionOrderId,
    );
    if (!speditionOrder) {
      return null;
    }

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
    const speditionOrder = await this.speditionOrderRepository.findById(
      companyId,
      speditionOrderId,
    );
    if (!speditionOrder) {
      return null;
    }

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
    const speditionOrder = await this.speditionOrderRepository.findById(
      companyId,
      speditionOrderId,
    );
    if (!speditionOrder) {
      return null;
    }

    this.speditionOrderFilesRepository.removeFile(
      companyId,
      speditionOrderId,
      filename,
    );
  }
}
