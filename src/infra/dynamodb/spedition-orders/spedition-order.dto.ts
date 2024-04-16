import { Item } from '../base';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { SpeditionOrder } from '../../../modules/spedition-orders/entities/spedition-order.entity';

type DynamoDBSpeditionOrderStatus =
  | 'DRAFT'
  | 'CREATED'
  | 'LOADED'
  | 'UNLOADED'
  | 'DONE'
  | 'STORNO';

export class DynamoDBSpeditionOrderDto extends Item {
  public id: string;
  public orderId: string;
  public creationDate: number;
  public companyId: string;
  public creator: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  public contractor?: {
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
  public driver: {
    name: string;
    phoneNumber: string;
    identityCardNumber: string;
  };
  public vehicle: {
    carLicensePlate: string;
    trailerLicensePlate: string;
  };
  public loading: {
    date: number;
    endDate: number;
    time: string;
    address: string;
    loadingNumber: string;
    additionalInfo: string;
  };
  public unloading: {
    date: number;
    endDate: number;
    time: string;
    address: string;
    unloadingNumber: string;
    additionalInfo: string;
  };
  public loadDetails: Array<{
    name: string;
    value: string;
  }>;
  public freight: {
    value: string;
    vatRate: number;
    currency: 'EUR' | 'PLN';
    paymentDays: number;
  };
  public status: DynamoDBSpeditionOrderStatus;
  public additionalInfo: string;

  constructor() {
    super();
  }

  public get pk() {
    return `Company#${this.companyId}/SpeditionOrder`;
  }

  public get sk() {
    return `SpeditionOrder#${this.id}`;
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      id: { S: this.id },
      orderId: { S: this.orderId },
      creationDate: { N: this.creationDate.toString() },
      companyId: { S: this.companyId },
      creator: {
        M: {
          id: { S: this.creator.id },
          name: { S: this.creator.name },
          email: { S: this.creator.email },
          phoneNumber: { S: this.creator.phoneNumber },
        },
      },
      contractor: this.contractor
        ? {
            M: {
              id: { S: this.contractor.id },
              name: { S: this.contractor.name },
              nip: { S: this.contractor.nip },
              address: { S: this.contractor.address },
              phoneNumber: { S: this.contractor.phoneNumber },
              email: { S: this.contractor.email },
              contact: this.contractor.contact
                ? {
                    M: {
                      id: { S: this.contractor.contact.id },
                      name: { S: this.contractor.contact.name },
                      phoneNumber: { S: this.contractor.contact.phoneNumber },
                      email: { S: this.contractor.contact.email },
                    },
                  }
                : undefined,
            },
          }
        : undefined,
      driver: {
        M: {
          name: { S: this.driver.name },
          phoneNumber: { S: this.driver.phoneNumber },
          identityCardNumber: { S: this.driver.identityCardNumber },
        },
      },
      vehicle: {
        M: {
          carLicensePlate: { S: this.vehicle.carLicensePlate },
          trailerLicensePlate: { S: this.vehicle.trailerLicensePlate },
        },
      },
      loading: {
        M: {
          date: { N: this.loading.date.toString() },
          endDate: { N: this.loading.endDate?.toString() },
          time: { S: this.loading.time },
          address: { S: this.loading.address },
          loadingNumber: { S: this.loading.loadingNumber },
          additionalInfo: { S: this.loading.additionalInfo },
        },
      },
      unloading: {
        M: {
          date: { N: this.unloading.date.toString() },
          endDate: { N: this.unloading.endDate?.toString() },
          time: { S: this.unloading.time },
          address: { S: this.unloading.address },
          unloadingNumber: { S: this.unloading.unloadingNumber },
          additionalInfo: { S: this.unloading.additionalInfo },
        },
      },
      loadDetails: {
        L: this.loadDetails.map(({ name, value }) => ({
          M: {
            name: { S: name },
            value: { S: value },
          },
        })),
      },
      freight: {
        M: {
          value: { S: this.freight.value },
          vatRate: { N: this.freight.vatRate.toString() },
          currency: { S: this.freight.currency },
          paymentDays: { N: this.freight.paymentDays.toString() },
        },
      },
      status: { S: this.status },
      additionalInfo: { S: this.additionalInfo },
    };
  }

  public toDomain = (): SpeditionOrder => ({
    id: this.id,
    orderId: this.orderId,
    creationDate: this.creationDate,
    companyId: this.companyId,
    creator: this.creator,
    contractor: this.contractor,
    driver: this.driver,
    vehicle: this.vehicle,
    loading: this.loading,
    unloading: this.unloading,
    loadDetails: this.loadDetails,
    freight: this.freight,
    status: this.status,
    additionalInfo: this.additionalInfo,
  });

  static fromDomain = (
    speditionOrder: SpeditionOrder,
  ): DynamoDBSpeditionOrderDto => {
    const dto = new DynamoDBSpeditionOrderDto();
    dto.id = speditionOrder.id;
    dto.orderId = speditionOrder.orderId;
    dto.creationDate = speditionOrder.creationDate;
    dto.companyId = speditionOrder.companyId;
    dto.creator = speditionOrder.creator;
    dto.contractor = speditionOrder.contractor;
    dto.driver = speditionOrder.driver;
    dto.vehicle = speditionOrder.vehicle;
    dto.loading = speditionOrder.loading;
    dto.unloading = speditionOrder.unloading;
    dto.loadDetails = speditionOrder.loadDetails;
    dto.freight = speditionOrder.freight;
    dto.status = speditionOrder.status;
    dto.additionalInfo = speditionOrder.additionalInfo;

    return dto;
  };

  static fromItem = (
    contractorItem: AttributeMap,
  ): DynamoDBSpeditionOrderDto => {
    const dto = new DynamoDBSpeditionOrderDto();

    const loadingDate = contractorItem.loading.M.date.N;
    const unloadingDate = contractorItem.unloading.M.date.N;

    dto.id = contractorItem.id.S;
    dto.orderId = contractorItem.orderId.S;
    dto.creationDate = Number(contractorItem.creationDate.N);
    dto.companyId = contractorItem.companyId.S;
    dto.creator = {
      id: contractorItem.creator.M.id.S,
      name: contractorItem.creator.M.name.S,
      email: contractorItem.creator.M.email.S,
      phoneNumber: contractorItem.creator.M.phoneNumber.S,
    };
    dto.contractor = contractorItem.contractor && {
      id: contractorItem.contractor.M.id.S,
      name: contractorItem.contractor.M.name.S,
      nip: contractorItem.contractor.M.nip.S,
      address: contractorItem.contractor.M.address.S,
      phoneNumber: contractorItem.contractor.M.phoneNumber.S,
      email: contractorItem.contractor.M.email.S,
      contact: contractorItem.contractor.M.contact && {
        id: contractorItem.contractor.M.contact.M.id.S,
        name: contractorItem.contractor.M.contact.M.name.S,
        phoneNumber: contractorItem.contractor.M.contact.M.phoneNumber.S,
        email: contractorItem.contractor.M.contact.M.email.S,
      },
    };
    dto.driver = {
      name: contractorItem.driver.M.name.S,
      phoneNumber: contractorItem.driver.M.phoneNumber.S,
      identityCardNumber: contractorItem.driver.M.identityCardNumber.S,
    };
    dto.vehicle = {
      carLicensePlate: contractorItem.vehicle.M.carLicensePlate.S,
      trailerLicensePlate: contractorItem.vehicle.M.trailerLicensePlate.S,
    };
    dto.loading = {
      date: Number(loadingDate),
      endDate: Number(contractorItem.loading.M.endDate?.N || loadingDate),
      time: contractorItem.loading.M.time?.S || '',
      address: contractorItem.loading.M.address.S,
      loadingNumber: contractorItem.loading.M.loadingNumber.S,
      additionalInfo: contractorItem.loading.M.additionalInfo.S,
    };
    dto.unloading = {
      date: Number(unloadingDate),
      endDate: Number(contractorItem.unloading.M.endDate?.N || unloadingDate),
      time: contractorItem.unloading.M.time?.S || '',
      address: contractorItem.unloading.M.address.S,
      unloadingNumber: contractorItem.unloading.M.unloadingNumber.S,
      additionalInfo: contractorItem.unloading.M.additionalInfo.S,
    };
    dto.loadDetails = contractorItem.loadDetails.L.map((item) => ({
      name: item.M.name.S,
      value: item.M.value.S,
    }));
    dto.freight = {
      value: contractorItem.freight.M.value.S,
      vatRate: Number(contractorItem.freight.M.vatRate.N),
      currency: contractorItem.freight.M.currency.S as 'EUR' | 'PLN',
      paymentDays: Number(contractorItem.freight.M.paymentDays.N),
    };
    dto.status = contractorItem.status.S as DynamoDBSpeditionOrderStatus;
    dto.additionalInfo = contractorItem.additionalInfo.S;

    return dto;
  };
}
