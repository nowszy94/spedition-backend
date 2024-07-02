import { Contractor } from './entities/contractor.entity';

export interface ContractorsRepository {
  findAllContractors(companyId: string): Promise<Array<Contractor>>;

  findContractorById(
    companyId: string,
    contractorId: string,
  ): Promise<Contractor | null>;

  createContractor(contractor: Contractor): Promise<Contractor>;

  updateContractor(
    companyId: string,
    id: string,
    contractor: Contractor,
  ): Promise<Contractor>;

  deleteContractor(companyId: string, id: string): Promise<void>;
}
