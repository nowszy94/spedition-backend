export type SpeditionOrderStatus =
  | 'DRAFT'
  | 'INPROGRESS'
  | 'DONE'
  | 'STORNO'
  | 'REMOVED';
export interface SpeditionOrder {
  id: string;
  orderId: string;
  creationDate: number;
  creator: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  contractor: {
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
    address: string;
    loadingNumber: string;
    additionalInfo: string;
  };
  unloading: {
    date: number;
    address: string;
    unloadingNumber: string;
    additionalInfo: string;
  };
  freight: {
    value: string;
    vatRate: number;
    currency: 'EUR' | 'PLN';
  };
  status: SpeditionOrderStatus;
  additionalInfo: string;
}