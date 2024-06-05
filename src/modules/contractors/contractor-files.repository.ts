import { ContractorFileEntity } from './entities/contractor-file.entity';

export interface ContractorFilesRepository {
  listFilesByContractorId(
    companyId: string,
    contractorId: string,
  ): Promise<Array<ContractorFileEntity>>;

  getFileByFilename(
    companyId: string,
    contractorId: string,
    filename: string,
  ): Promise<any>;

  getFilePresignedUrlByFilename(
    companyId: string,
    contractorId: string,
    filename: string,
  ): Promise<string>;

  addFiles(
    companyId: string,
    contractorId: string,
    files: Array<Express.Multer.File>,
  ): Promise<void>;

  removeFile(
    companyId: string,
    contractorId: string,
    filename: string,
  ): Promise<void>;
}
