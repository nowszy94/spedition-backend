import { v4 as uuidv4 } from 'uuid';

import { SpeditionOrder } from '../entities/spedition-order.entity';

export class CreateSpeditionOrderDto {
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
  additionalInfo: string;

  static toNewEntity = (
    dto: CreateSpeditionOrderDto,
    creator: SpeditionOrder['creator'],
    contractor: SpeditionOrder['contractor'],
    orderId: string,
  ): SpeditionOrder => ({
    id: uuidv4(),
    orderId,
    creationDate: new Date().getTime(),
    status: 'DRAFT',
    creator,
    contractor,
    driver: dto.driver,
    vehicle: dto.vehicle,
    loading: dto.loading,
    unloading: dto.unloading,
    freight: dto.freight,
    additionalInfo: dto.additionalInfo,
  });
}