import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import * as moment from 'moment';

import { Item } from '../base';
import { SpeditionOrder } from '../../../modules/spedition-orders/entities/spedition-order.entity';
import { buildOrderMonthYear } from './build-order-month-year';

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
  public comment: string;

  constructor() {
    super();
  }

  public get pk() {
    return `Company#${this.companyId}/SpeditionOrder`;
  }

  public get sk() {
    return `SpeditionOrder#${this.id}`;
  }

  private gsiKeys(): Record<string, unknown> {
    let gsiKeys: Record<string, unknown> = {
      GSI1PK: {
        S: `Company#${this.companyId}/SpeditionOrderCreator#${this.creator.id}`,
      },
      GSI1SK: {
        S: `SpeditionOrder#${this.id}`,
      },
    };

    if (this.orderId) {
      const unloadingDate = moment(this.unloading.date);
      const orderMonthYear = buildOrderMonthYear(
        unloadingDate.month() + 1,
        unloadingDate.year(),
      );

      gsiKeys = {
        ...gsiKeys,
        GSI2PK: {
          S: `Company#${this.companyId}/SpeditionOrderMonth#${orderMonthYear}`,
        },
        GSI2SK: {
          S: `SpeditionOrder#${this.id}`,
        },
      };
    }

    return gsiKeys;
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      ...this.gsiKeys(),
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
      comment: { S: this.comment || '' },
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
    comment: this.comment,
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
    dto.comment = speditionOrder.comment;

    return dto;
  };

  static fromItem = (
    speditionOrderItem: AttributeMap,
  ): DynamoDBSpeditionOrderDto => {
    const dto = new DynamoDBSpeditionOrderDto();

    const loadingDate = speditionOrderItem.loading.M.date.N;
    const unloadingDate = speditionOrderItem.unloading.M.date.N;

    dto.id = speditionOrderItem.id.S;
    dto.orderId = speditionOrderItem.orderId.S;
    dto.creationDate = Number(speditionOrderItem.creationDate.N);
    dto.companyId = speditionOrderItem.companyId.S;
    dto.creator = {
      id: speditionOrderItem.creator.M.id.S,
      name: speditionOrderItem.creator.M.name.S,
      email: speditionOrderItem.creator.M.email.S,
      phoneNumber: speditionOrderItem.creator.M.phoneNumber.S,
    };
    dto.contractor = speditionOrderItem.contractor && {
      id: speditionOrderItem.contractor.M.id.S,
      name: speditionOrderItem.contractor.M.name.S,
      nip: speditionOrderItem.contractor.M.nip.S,
      address: speditionOrderItem.contractor.M.address.S,
      phoneNumber: speditionOrderItem.contractor.M.phoneNumber.S,
      email: speditionOrderItem.contractor.M.email.S,
      contact: speditionOrderItem.contractor.M.contact && {
        id: speditionOrderItem.contractor.M.contact.M.id.S,
        name: speditionOrderItem.contractor.M.contact.M.name.S,
        phoneNumber: speditionOrderItem.contractor.M.contact.M.phoneNumber.S,
        email: speditionOrderItem.contractor.M.contact.M.email.S,
      },
    };
    dto.driver = {
      name: speditionOrderItem.driver.M.name.S,
      phoneNumber: speditionOrderItem.driver.M.phoneNumber.S,
      identityCardNumber: speditionOrderItem.driver.M.identityCardNumber.S,
    };
    dto.vehicle = {
      carLicensePlate: speditionOrderItem.vehicle.M.carLicensePlate.S,
      trailerLicensePlate: speditionOrderItem.vehicle.M.trailerLicensePlate.S,
    };
    dto.loading = {
      date: Number(loadingDate),
      endDate: Number(speditionOrderItem.loading.M.endDate?.N || loadingDate),
      time: speditionOrderItem.loading.M.time?.S || '',
      address: speditionOrderItem.loading.M.address.S,
      loadingNumber: speditionOrderItem.loading.M.loadingNumber.S,
      additionalInfo: speditionOrderItem.loading.M.additionalInfo.S,
    };
    dto.unloading = {
      date: Number(unloadingDate),
      endDate: Number(
        speditionOrderItem.unloading.M.endDate?.N || unloadingDate,
      ),
      time: speditionOrderItem.unloading.M.time?.S || '',
      address: speditionOrderItem.unloading.M.address.S,
      unloadingNumber: speditionOrderItem.unloading.M.unloadingNumber.S,
      additionalInfo: speditionOrderItem.unloading.M.additionalInfo.S,
    };
    dto.loadDetails = speditionOrderItem.loadDetails.L.map((item) => ({
      name: item.M.name.S,
      value: item.M.value.S,
    }));
    dto.freight = {
      value: speditionOrderItem.freight.M.value.S,
      vatRate: Number(speditionOrderItem.freight.M.vatRate.N),
      currency: speditionOrderItem.freight.M.currency.S as 'EUR' | 'PLN',
      paymentDays: Number(speditionOrderItem.freight.M.paymentDays.N),
    };
    dto.status = speditionOrderItem.status.S as DynamoDBSpeditionOrderStatus;
    dto.additionalInfo = speditionOrderItem.additionalInfo.S;
    dto.comment = speditionOrderItem.comment?.S || '';

    return dto;
  };
}
