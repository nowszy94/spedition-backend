import { SpeditionOrder } from './entities/spedition-order.entity';

export interface SpeditionOrdersRepository {
  findAllSpeditionOrders: (companyId: string) => Promise<Array<SpeditionOrder>>;
  findSpeditionOrderById: (
    companyId: string,
    id: string,
  ) => Promise<SpeditionOrder>;
  createSpeditionOrder: (order: SpeditionOrder) => Promise<SpeditionOrder>;
  updateSpeditionOrder: (
    updatedOrder: SpeditionOrder,
  ) => Promise<SpeditionOrder | null>;
  deleteSpeditionOrder: (companyId: string, id: string) => Promise<void>;
}
