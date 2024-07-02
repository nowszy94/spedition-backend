import moment from 'moment';
import { Injectable } from '@nestjs/common';
import { ContractorsRepository } from './contractors-repository.port';
import { ContractorFilesRepository } from './contractor-files.repository';
import { ContractorFileEntity } from './entities/contractor-file.entity';
import { S3ContractorFilesRepository } from '../../infra/s3/spedition-orders/s3-contractor-files.repository';
import { DynamoDBContractorsRepository } from '../../infra/dynamodb/contractors/contractors.repository';
import { ContractorNotFoundException } from './errors/ContractorNotFoundException';

@Injectable()
export class ContractorFilesService {
  private readonly contractorRepository: ContractorsRepository;
  private readonly contractorFilesRepository: ContractorFilesRepository;

  constructor() {
    this.contractorRepository = new DynamoDBContractorsRepository();
    this.contractorFilesRepository = new S3ContractorFilesRepository();
  }

  async uploadFiles(
    companyId: string,
    contractorId: string,
    files: Array<Express.Multer.File>,
  ) {
    await this.findContractorOrThrow(companyId, contractorId);

    await this.contractorFilesRepository.addFiles(
      companyId,
      contractorId,
      files,
    );
  }

  async listFilesByContractorId(
    companyId: string,
    contractorId: string,
  ): Promise<Array<ContractorFileEntity>> {
    await this.findContractorOrThrow(companyId, contractorId);

    const result = await this.contractorFilesRepository.listFilesByContractorId(
      companyId,
      contractorId,
    );

    return result.sort((a, b) => {
      const aDate = moment(a.lastModified);
      const bDate = moment(b.lastModified);

      return bDate.diff(aDate);
    });
  }

  async getContractorFile(
    companyId: string,
    contractorId: string,
    filename: string,
  ) {
    await this.findContractorOrThrow(companyId, contractorId);

    return this.contractorFilesRepository.getFileByFilename(
      companyId,
      contractorId,
      filename,
    );
  }

  async getContractorFilePresignedUrl(
    companyId: string,
    contractorId: string,
    filename: string,
  ): Promise<string> {
    await this.findContractorOrThrow(companyId, contractorId);

    return this.contractorFilesRepository.getFilePresignedUrlByFilename(
      companyId,
      contractorId,
      filename,
    );
  }

  async removeContractorFile(
    companyId: string,
    contractorId: string,
    filename: string,
  ) {
    const contractor = await this.contractorRepository.findContractorById(
      companyId,
      contractorId,
    );
    if (!contractor) {
      return null;
    }

    this.contractorFilesRepository.removeFile(
      companyId,
      contractorId,
      filename,
    );
  }

  private async findContractorOrThrow(companyId: string, contractorId: string) {
    const contractor = await this.contractorRepository.findContractorById(
      companyId,
      contractorId,
    );
    if (!contractor) {
      throw new ContractorNotFoundException(contractorId);
    }
    return contractor;
  }
}
