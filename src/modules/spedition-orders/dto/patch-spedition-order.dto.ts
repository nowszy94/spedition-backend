import { SpeditionOrder } from '../entities/spedition-order.entity';

export type PatchSpeditionOrderDto =
  | PatchSpeditionOrderStatusDto
  | PatchSpeditionOrderOrderIdDto
  | PatchSpeditionOrderContractorDto
  | PatchSpeditionOrderLoadingCompletedDto
  | PatchSpeditionOrderUnloadingCompletedDto;

export type PatchSpeditionOrderStatusDto = Pick<SpeditionOrder, 'status'>;
export type PatchSpeditionOrderOrderIdDto = Pick<SpeditionOrder, 'orderId'>;
export type PatchSpeditionOrderContractorDto = Pick<
  SpeditionOrder,
  'contractor'
>;
export type PatchSpeditionOrderLoadingCompletedDto = {
  loadingCompleted: {
    index: number;
    completed: boolean;
  };
};
export type PatchSpeditionOrderUnloadingCompletedDto = {
  unloadingCompleted: {
    index: number;
    completed: boolean;
  };
};
