import { SpeditionOrderFileEntity } from '../entities/spedition-order-file.entity';

export interface SpeditionOrderFilesRepository {
  listFilesBySpeditionOrderId(
    companyId: string,
    speditionOrderId: string,
  ): Promise<Array<SpeditionOrderFileEntity>>;

  getFileByFilename(
    companyId: string,
    speditionOrderId: string,
    filename: string,
  ): Promise<any>;

  getFilePresignedUrlByFilename(
    companyId: string,
    speditionOrderId: string,
    filename: string,
  ): Promise<string>;

  addFiles(
    companyId: string,
    speditionOrderId: string,
    files: Array<Express.Multer.File>,
  ): Promise<void>;

  removeFile(
    companyId: string,
    speditionOrderId: string,
    filename: string,
  ): Promise<void>;
}
