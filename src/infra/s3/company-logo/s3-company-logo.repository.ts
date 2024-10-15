import { CompanyLogoRepository } from '../../../modules/settings/company-logo.repository';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const BUCKET_NAME =
  process.env.filesBucketName || 'rabbitspedition-files-bucket';

export class S3CompanyLogoRepository implements CompanyLogoRepository {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.region || 'eu-central-1',
    });
  }

  async findById(companyId: string): Promise<{
    contentType: string;
    contentLength: number;
    body: ReadableStream;
  }> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: this.buildCompanyLogoPath(companyId),
    });
    const response = await this.s3Client.send(command);

    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      body: response.Body.transformToWebStream(),
    };
  }

  async addLogo(companyId: string, file: Express.Multer.File): Promise<void> {
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: this.buildCompanyLogoPath(companyId),
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(uploadCommand);
  }

  private buildCompanyLogoPath(companyId: string) {
    return `${companyId}/company-details/logo`;
  }
}
