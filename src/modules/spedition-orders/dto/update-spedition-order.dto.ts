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
};
