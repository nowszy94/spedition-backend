import { SpeditionOrderStatus } from '../entities/spedition-order.entity';

export type UpdateSpeditionOrderDto = {
  id: string;
  orderId: string;
  creationDate: number;
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
  freight: {
    value: string;
    vatRate: number;
    currency: 'EUR' | 'PLN';
  };
  status: SpeditionOrderStatus;
  additionalInfo: string;
};
