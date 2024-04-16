import { ulid } from 'ulid';
import { SpeditionOrder } from '../entities/spedition-order.entity';

export class CreateSpeditionOrderDto {
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
  additionalInfo: string;

  static toNewEntity = (
    companyId: string,
    dto: CreateSpeditionOrderDto,
    creator: SpeditionOrder['creator'],
    contractor?: SpeditionOrder['contractor'],
    orderId?: string,
  ): SpeditionOrder => ({
    id: ulid(),
    orderId: orderId || '', // TODO create separate entity type for drafts
    creationDate: new Date().getTime(),
    status: 'DRAFT',
    creator,
    contractor,
    companyId,
    driver: dto.driver,
    vehicle: dto.vehicle,
    loading: dto.loading,
    loadDetails: dto.loadDetails,
    unloading: dto.unloading,
    freight: dto.freight,
    additionalInfo: dto.additionalInfo,
  });
}
