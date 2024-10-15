import { Injectable } from '@nestjs/common';
import { CompanyLogoRepository } from './company-logo.repository';
import { S3CompanyLogoRepository } from '../../infra/s3/company-logo/s3-company-logo.repository';

@Injectable()
export class CompanyLogoService {
  private readonly companyLogoRepository: CompanyLogoRepository;

  constructor() {
    this.companyLogoRepository = new S3CompanyLogoRepository();
  }

  async findCompanyLogo(companyId: string) {
    return await this.companyLogoRepository.findById(companyId);
  }

  async uploadCompanyLogo(companyId: string, file: Express.Multer.File) {
    await this.companyLogoRepository.addLogo(companyId, file);
  }
}
