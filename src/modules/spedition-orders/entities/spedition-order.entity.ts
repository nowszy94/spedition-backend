export type SpeditionOrderStatus =
  | 'DRAFT'
  | 'CREATED'
  | 'LOADED'
  | 'UNLOADED'
  | 'DONE'
  | 'STORNO';

export interface SpeditionOrder {
  id: string;
  orderId: string;
  companyId: string;
  creationDate: number;
  creator: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  contractor?: {
    id: string;
    name: string;
    nip: string;
    address: string;
    phoneNumber: string;
    email: string;
    contact?: {
      id: string;
      name: string;
      phoneNumber: string;
      email: string;
    };
  };
  driver: {
    name: string;
    phoneNumber: string;
    identityCardNumber: string;
  };
  vehicle: {
    carLicensePlate: string;
    trailerLicensePlate: string;
  };
  loading: {
    date: number;
    endDate: number;
    time: string;
    address: string;
    loadingNumber: string;
    additionalInfo: string;
  };
  unloading: {
    date: number;
    endDate: number;
    time: string;
    address: string;
    unloadingNumber: string;
    additionalInfo: string;
  };
  loadDetails: Array<{
    name: string;
    value: string;
  }>;
  freight: {
    value: string;
    vatRate: number;
    currency: 'EUR' | 'PLN';
    paymentDays: number;
  };
  status: SpeditionOrderStatus;
  additionalInfo: string;
  comment: string;
}
