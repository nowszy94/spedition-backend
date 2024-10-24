import moment from 'moment';
import { Injectable } from '@nestjs/common';

import { SpeditionOrdersRepository } from './ports/spedition-orders.repository';
import { SpeditionOrder } from './entities/spedition-order.entity';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/dynamodb-spedition-order.repository';
import { Moment } from 'moment';
import {
  CheckedStatus,
  SpeditionOrderFeedItem,
  SpeditionOrderFeedResponse,
} from './entities/spedition-orders-feed.entity';

@Injectable()
export class SpeditionOrdersFeedService {
  private readonly speditionOrdersRepository: SpeditionOrdersRepository;
  private today: Moment;
  private tomorrow: Moment;

  constructor() {
    this.speditionOrdersRepository = new DynamoDBSpeditionOrderRepository();
    this.today = moment();
    this.tomorrow = moment().add(1, 'day');
  }

  async getSpeditionOrdersFeed(
    companyId: string,
  ): Promise<SpeditionOrderFeedResponse> {
    this.today = moment();
    this.tomorrow = moment().add(1, 'day');

    const [ofStatusCreated, ofStatusLoaded, ofStatusUnloaded] =
      await Promise.all([
        this.speditionOrdersRepository.findAllByStatus(companyId, 'CREATED'),
        this.speditionOrdersRepository.findAllByStatus(companyId, 'LOADED'),
        this.speditionOrdersRepository.findAllByStatus(companyId, 'UNLOADED'),
      ]);

    const speditionOrders = [
      ...ofStatusCreated,
      ...ofStatusLoaded,
      ...ofStatusUnloaded,
    ];

    const initValue: SpeditionOrderFeedResponse = {
      loading: {
        forToday: [],
        forTomorrow: [],
        late: [],
      },
      unloading: {
        forToday: [],
        forTomorrow: [],
        late: [],
      },
    };

    return speditionOrders
      .map((order) => this.enrichWithFeedStages(order))
      .reduce((acc, order) => {
        const { status, loadingStage, unloadingStage } = order;

        if (loadingStage) {
          acc.loading[loadingStage].push(
            this.buildFeedItem(
              order,
              order.loading.map(({ address, date, endDate, completed }) => ({
                address,
                date,
                endDate,
                completed,
              })),
              status === 'CREATED' ? 'toLoad' : 'loaded',
            ),
          );
        }

        if (unloadingStage) {
          acc.unloading[unloadingStage].push(
            this.buildFeedItem(
              order,
              order.unloading.map(({ address, date, endDate, completed }) => ({
                address,
                date,
                endDate,
                completed,
              })),
              status === 'CREATED'
                ? 'toUnloadAndNotYetLoaded'
                : status === 'LOADED'
                  ? 'toUnload'
                  : 'unloaded',
            ),
          );
        }

        return acc;
      }, initValue);
  }

  private enrichWithFeedStages = (order: SpeditionOrder) => {
    const { loading, unloading, status } = order;

    const firstLoading = loading[0];
    const firstUnloading = unloading[0];

    const loadingDate = moment(firstLoading.date);
    const loadingEndDate = moment(firstLoading.endDate);

    const unloadingDate = moment(firstUnloading.date);
    const unloadingEndDate = moment(firstUnloading.endDate);

    let loadingStage;

    if (this.isForToday(loadingDate, loadingEndDate)) {
      loadingStage = 'forToday';
    } else if (this.isForTomorrow(loadingDate, loadingEndDate)) {
      loadingStage = 'forTomorrow';
    } else if (status === 'CREATED' && this.isLate(loadingEndDate)) {
      loadingStage = 'late';
    }

    let unloadingStage;

    if (this.isForToday(unloadingDate, unloadingEndDate)) {
      unloadingStage = 'forToday';
    } else if (this.isForTomorrow(unloadingDate, unloadingEndDate)) {
      unloadingStage = 'forTomorrow';
    } else if (status !== 'UNLOADED' && this.isLate(unloadingEndDate)) {
      unloadingStage = 'late';
    }

    return {
      ...order,
      loadingStage,
      unloadingStage,
    };
  };

  private buildFeedItem = (
    speditionOrder: SpeditionOrder,
    items: SpeditionOrderFeedItem['elements'],
    status: CheckedStatus,
  ): SpeditionOrderFeedItem => {
    const firstDateFrom = [...items].sort((a, b) => a.date - b.date)[0];
    const lastDateTo = [...items].sort((a, b) => b.endDate - a.endDate)[0];

    const { contractor } = speditionOrder;

    return {
      id: speditionOrder.id,
      type: status,
      orderId: speditionOrder.orderId,
      contractor: contractor && {
        id: contractor.id,
        name: contractor.name,
        nip: contractor.nip,
        email: contractor.email,
        phoneNumber: contractor.phoneNumber,
        contact: contractor.contact && {
          name: contractor.contact.name,
          email: contractor.contact.email,
          phoneNumber: contractor.contact.phoneNumber,
        },
      },
      date: firstDateFrom.date,
      endDate: lastDateTo.endDate,
      elements: items.map(({ address, date, endDate, completed }) => ({
        address,
        date,
        endDate,
        completed,
      })),
    };
  };

  private isForToday = (date: moment.Moment, endDate: moment.Moment) =>
    this.today.isBetween(date, endDate, 'day', '[]');

  private isForTomorrow = (date: moment.Moment, endDate: moment.Moment) =>
    this.tomorrow.isBetween(date, endDate, 'day', '[]');

  private isLate = (endDate: moment.Moment) =>
    this.today.isAfter(endDate, 'day');
}
