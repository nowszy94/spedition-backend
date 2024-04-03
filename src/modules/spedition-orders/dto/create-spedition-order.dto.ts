import { ulid } from 'ulid';
import { SpeditionOrder } from '../entities/spedition-order.entity';

export class CreateSpeditionOrderDto {
  companyId: string;
  creator: {
    id: string;
  };
  contractor?: {
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
  additionalInfo: string;

  static toNewEntity = (
    dto: CreateSpeditionOrderDto,
    creator: SpeditionOrder['creator'],
    contractor: SpeditionOrder['contractor'],
    orderId: string,
  ): SpeditionOrder => ({
    id: ulid(),
    orderId,
    creationDate: new Date().getTime(),
    status: 'DRAFT',
    creator,
    contractor,
    companyId: dto.companyId,
    driver: dto.driver,
    vehicle: dto.vehicle,
    loading: dto.loading,
    loadDetails: dto.loadDetails,
    unloading: dto.unloading,
    freight: dto.freight,
    additionalInfo: dto.additionalInfo,
  });
}
