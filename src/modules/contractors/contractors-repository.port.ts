import { Contractor } from './entities/contractor.entity';

export interface ContractorsRepository {
  findAllContractors(companyId: string): Promise<Array<Contractor>>;
  findContractor(companyId: string, contractorId: string): Promise<Contractor>;
  createContractor(contractor: Contractor): Promise<Contractor>;
  updateContractor(contractor: Contractor): Promise<Contractor>;
  deleteContractor(companyId: string, id: string): Promise<void>;
}