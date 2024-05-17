import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { SpeditionOrderFilesRepository } from '../../../modules/spedition-orders/spedition-order-files.repository';
import { SpeditionOrderFileEntity } from '../../../modules/spedition-orders/entities/spedition-order-file.entity';

const BUCKET_NAME =
  process.env.filesBucketName || 'rabbitspedition-files-bucket';

export class S3SpeditionOrderFilesRepository
  implements SpeditionOrderFilesRepository
{
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.region || 'eu-central-1',
    });
  }

  async addFiles(
    companyId: string,
    speditionOrderId: string,
    files: Array<Express.Multer.File>,
  ) {
    files.forEach((file) => {
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${this.buildSpeditionOrderFilesPath(companyId, speditionOrderId)}/${file.originalname}`,
        Body: file.buffer,
      });

      this.s3Client.send(uploadCommand);
    });
  }

  async listFilesBySpeditionOrderId(
    companyId: string,
    speditionOrderId: string,
  ): Promise<Array<SpeditionOrderFileEntity>> {
    const listObjectsCommand = new ListObjectsCommand({
      Bucket: BUCKET_NAME,
      Prefix: `${this.buildSpeditionOrderFilesPath(companyId, speditionOrderId)}`,
    });

    const result = await this.s3Client.send(listObjectsCommand);

    return (
      result.Contents?.map(({ Key, LastModified, Size }) => {
        const filename = Key.split('/').pop();

        return {
          name: filename,
          path: `/spedition-orders/${speditionOrderId}/files/${filename}`,
          lastModified: LastModified.getTime(),
          byteSize: Size,
        };
      }) || []
    );
  }

  async getFileByFilename(
    companyId: string,
    speditionOrderId: string,
    filename: string,
  ) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${this.buildSpeditionOrderFilesPath(companyId, speditionOrderId)}/${filename}`,
    });

    const result = await this.s3Client.send(getObjectCommand);

    return result.Body;
  }

  async removeFile(
    companyId: string,
    speditionOrderId: string,
    filename: string,
  ): Promise<void> {
    const removeObjectCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${this.buildSpeditionOrderFilesPath(companyId, speditionOrderId)}/${filename}`,
    });

    await this.s3Client.send(removeObjectCommand);
  }

  private buildSpeditionOrderFilesPath(
    companyId: string,
    speditionOrderId: string,
  ) {
    return `${companyId}/spedition-orders/${speditionOrderId}`;
  }
}
