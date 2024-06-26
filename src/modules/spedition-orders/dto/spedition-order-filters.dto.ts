import { SpeditionOrdersFiltersEntity } from '../entities/spedition-orders-filters.entity';

export type SpeditionOrderFilterRequestDto = {
  orderMonth?: number;
  orderYear?: number;
  creatorId?: string;
  query?: string;
  contractorId?: string
};

export const mapToSpeditionOrdersFilters = (
  requestFilters: SpeditionOrderFilterRequestDto,
): SpeditionOrdersFiltersEntity | undefined => {
  let filters: SpeditionOrdersFiltersEntity | undefined = undefined;

  if (requestFilters.orderMonth && requestFilters.orderYear) {
    filters = {
      ...filters,
      orderMonthYear: {
        month: requestFilters.orderMonth,
        year: requestFilters.orderYear,
      },
    };
  }

  if (requestFilters.creatorId) {
    filters = {
      ...filters,
      creator: {
        id: requestFilters.creatorId,
      },
    };
  }

  // if (requestFilters.contractorId) {
  //   filters = {
  //     ...filters,
  //     contractor: {
  //       id: requestFilters.contractorId,
  //     },
  //   };
  // }

  return filters;
};
