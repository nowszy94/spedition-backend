import { SpeditionOrderStatus } from '../entities/spedition-order.entity';

export type UpdateSpeditionOrderDto = {
  creator: {
    id: string;
  };
  contractor: {
    id: string;
    contactId: string;
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
  loading: Array<{
    date: number;
    endDate: number;
    time: string;
    address: string;
    loadingNumber: string;
    additionalInfo: string;
    completed: boolean;
  }>;
  unloading: Array<{
    date: number;
    endDate: number;
    time: string;
    address: string;
    unloadingNumber: string;
    additionalInfo: string;
    completed: boolean;
  }>;
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
};
