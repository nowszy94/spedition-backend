import {
  SpeditionOrder,
  SpeditionOrderStatus,
} from '../entities/spedition-order.entity';
import { SpeditionOrdersFiltersEntity } from '../entities/spedition-orders-filters.entity';

export interface SpeditionOrdersRepository {
  findAll: (companyId: string) => Promise<Array<SpeditionOrder>>;

  findAllWithLimit: (
    companyId: string,
    limit?: number,
  ) => Promise<Array<SpeditionOrder>>;

  findAllByMonthYear: (
    companyId: string,
    monthYearFilters: SpeditionOrdersFiltersEntity['orderMonthYear'],
  ) => Promise<Array<SpeditionOrder>>;

  findAllByCreatorId: (
    companyId: string,
    creatorId: SpeditionOrdersFiltersEntity['creator']['id'],
  ) => Promise<Array<SpeditionOrder>>;

  findAllByContractorId: (
    companyId: string,
    contractorId: SpeditionOrdersFiltersEntity['contractor']['id'],
  ) => Promise<Array<SpeditionOrder>>;

  findAllByStatus: (
    companyId: string,
    status: SpeditionOrderStatus,
  ) => Promise<Array<SpeditionOrder>>;

  findById: (companyId: string, id: string) => Promise<SpeditionOrder>;

  create: (order: SpeditionOrder) => Promise<SpeditionOrder>;

  update: (updatedOrder: SpeditionOrder) => Promise<SpeditionOrder | null>;

  delete: (companyId: string, id: string) => Promise<void>;
}
