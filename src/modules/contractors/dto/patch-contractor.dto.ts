import { Contractor } from '../entities/contractor.entity';

export type PatchContractorDto = PatchContractorBlacklistDto;

export type PatchContractorBlacklistDto = Pick<Contractor, 'blacklist'>;
