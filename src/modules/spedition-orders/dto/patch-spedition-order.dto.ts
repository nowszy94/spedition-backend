import { SpeditionOrder } from '../entities/spedition-order.entity';

export type PatchSpeditionOrderDto =
  | PatchSpeditionOrderStatusDto
  | PatchSpeditionOrderOrderIdDto
  | PatchSpeditionOrderContractorDto;

export type PatchSpeditionOrderStatusDto = Pick<SpeditionOrder, 'status'>;
export type PatchSpeditionOrderOrderIdDto = Pick<SpeditionOrder, 'orderId'>;
export type PatchSpeditionOrderContractorDto = Pick<
  SpeditionOrder,
  'contractor'
>;
