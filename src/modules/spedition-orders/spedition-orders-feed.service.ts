import * as moment from 'moment';
import { Injectable } from '@nestjs/common';

import { SpeditionOrdersRepository } from './spedition-orders.repository';
import { SpeditionOrder } from './entities/spedition-order.entity';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/spedition-order.repository';
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

    const allOrders = await this.speditionOrdersRepository.findAll(companyId);

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

    return allOrders
      .filter(
        (order) =>
          order.status !== 'DRAFT' &&
          order.status !== 'DONE' &&
          order.status !== 'STORNO',
      )
      .map((order) => this.enrichWithFeedStages(order))
      .reduce((acc, order) => {
        const { loading, unloading, status, loadingStage, unloadingStage } =
          order;

        if (loadingStage) {
          const feedItem = this.buildFeedItem(
            order,
            loading.address,
            loading.date,
            loading.endDate,
            status === 'CREATED' ? 'toLoad' : 'loaded',
          );

          acc.loading[loadingStage].push(feedItem);
        }

        if (unloadingStage) {
          const feedItem = this.buildFeedItem(
            order,
            unloading.address,
            unloading.date,
            unloading.endDate,
            status === 'CREATED'
              ? 'toUnloadAndNotYetLoaded'
              : status === 'LOADED'
                ? 'toUnload'
                : 'unloaded',
          );
          acc.unloading[unloadingStage].push(feedItem);
        }

        return acc;
      }, initValue);
  }

  private enrichWithFeedStages = (order: SpeditionOrder) => {
    const { loading, unloading, status } = order;

    const loadingDate = moment(loading.date);
    const loadingEndDate = moment(loading.endDate);

    const unloadingDate = moment(unloading.date);
    const unloadingEndDate = moment(unloading.endDate);

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
    address: string,
    date: number,
    endDate: number,
    status: CheckedStatus,
  ): SpeditionOrderFeedItem => ({
    id: speditionOrder.id,
    type: status,
    orderId: speditionOrder.orderId,
    address,
    contractor: speditionOrder.contractor && {
      id: speditionOrder.contractor.id,
      name: speditionOrder.contractor.name,
    },
    date,
    endDate,
  });

  private isForToday = (date: moment.Moment, endDate: moment.Moment) =>
    this.today.isBetween(date, endDate, 'day', '[]');

  private isForTomorrow = (date: moment.Moment, endDate: moment.Moment) =>
    this.tomorrow.isBetween(date, endDate, 'day', '[]');

  private isLate = (endDate: moment.Moment) =>
    this.today.isAfter(endDate, 'day');
}
