import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { ContractorFilesRepository } from '../../../modules/contractors/contractor-files.repository';
import { ContractorFileEntity } from '../../../modules/contractors/entities/contractor-file.entity';

const BUCKET_NAME =
  process.env.filesBucketName || 'rabbitspedition-files-bucket';

export class S3ContractorFilesRepository implements ContractorFilesRepository {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.region || 'eu-central-1',
    });
  }

  async addFiles(
    companyId: string,
    contractorId: string,
    files: Array<Express.Multer.File>,
  ) {
    await Promise.all(
      files.map(
        (file) =>
          new Promise(async (resolve) => {
            const uploadCommand = new PutObjectCommand({
              Bucket: BUCKET_NAME,
              Key: `${this.buildContractorFilesPath(companyId, contractorId)}/${file.originalname}`,
              Body: file.buffer,
              ContentType: file.mimetype,
            });

            await this.s3Client.send(uploadCommand);
            resolve(true);
          }),
      ),
    );
  }

  async listFilesByContractorId(
    companyId: string,
    contractorId: string,
  ): Promise<Array<ContractorFileEntity>> {
    const listObjectsCommand = new ListObjectsCommand({
      Bucket: BUCKET_NAME,
      Prefix: `${this.buildContractorFilesPath(companyId, contractorId)}`,
    });

    const result = await this.s3Client.send(listObjectsCommand);

    return (
      result.Contents?.map(({ Key, LastModified, Size }) => {
        const filename = Key.split('/').pop();

        return {
          name: filename,
          path: `/contractors/${contractorId}/files/${filename}`,
          lastModified: LastModified.getTime(),
          byteSize: Size,
        };
      }) || []
    );
  }

  async getFileByFilename(
    companyId: string,
    contractorId: string,
    filename: string,
  ) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${this.buildContractorFilesPath(companyId, contractorId)}/${filename}`,
    });

    const result = await this.s3Client.send(getObjectCommand);

    return result.Body;
  }

  async getFilePresignedUrlByFilename(
    companyId: string,
    contractorId: string,
    filename: string,
  ) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${this.buildContractorFilesPath(companyId, contractorId)}/${filename}`,
    });

    return await getSignedUrl(this.s3Client, getObjectCommand, {
      expiresIn: 15 * 60, // 15 minutes
    });
  }

  async removeFile(
    companyId: string,
    contractorId: string,
    filename: string,
  ): Promise<void> {
    const removeObjectCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${this.buildContractorFilesPath(companyId, contractorId)}/${filename}`,
    });

    await this.s3Client.send(removeObjectCommand);
  }

  private buildContractorFilesPath(companyId: string, contractorId: string) {
    return `${companyId}/contractors/${contractorId}`;
  }
}
