export interface CompanyLogoRepository {
  findById(companyId: string): Promise<{
    contentType: string;
    contentLength: number;
    body: ReadableStream;
  }>;

  addLogo(companyId: string, file: Express.Multer.File): Promise<void>;
}
