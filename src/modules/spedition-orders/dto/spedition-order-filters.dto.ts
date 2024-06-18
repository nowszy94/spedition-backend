import { SpeditionOrdersFiltersEntity } from '../entities/spedition-orders-filters.entity';

export type SpeditionOrderFilterRequestDto = {
  orderMonth?: number;
  orderYear?: number;
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

  return filters;
};
