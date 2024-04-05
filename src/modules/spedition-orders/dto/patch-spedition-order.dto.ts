import { SpeditionOrderStatus } from '../entities/spedition-order.entity';

export type PatchSpeditionOrderDto = {
  status: SpeditionOrderStatus;
};
