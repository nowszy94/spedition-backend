export type SpeditionOrdersFiltersEntity = {
  orderMonthYear?: {
    month: number;
    year: number;
  };
  creator?: {
    id: string;
  };
  contractor?: {
    id: string;
  }
};
