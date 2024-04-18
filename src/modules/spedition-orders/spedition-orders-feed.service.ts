import * as moment from 'moment';
import { Injectable } from '@nestjs/common';

import { SpeditionOrdersRepository } from './spedition-orders.repository';
import { SpeditionOrder } from './entities/spedition-order.entity';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/spedition-order.repository';

type SpeditionOrderFeedItem = {
  id: string;
  type: 'toLoad' | 'toUnload';
  orderId: string;
  contractor?: {
    id: string;
    name: string;
  };
  address: string;
  date: number;
  endDate: number;
};

type SpeditionOrderFeed = {
  forToday: Array<SpeditionOrderFeedItem>;
  forTomorrow: Array<SpeditionOrderFeedItem>;
  late: Array<SpeditionOrderFeedItem>;
};

@Injectable()
export class SpeditionOrdersFeedService {
  private readonly speditionOrdersRepository: SpeditionOrdersRepository;

  constructor() {
    this.speditionOrdersRepository = new DynamoDBSpeditionOrderRepository();
  }

  async getSpeditionOrdersFeed(companyId: string): Promise<SpeditionOrderFeed> {
    const allOrders =
      await this.speditionOrdersRepository.findAllSpeditionOrders(companyId);

    const today = moment();
    const tomorrow = moment().add(1, 'day');

    const buildItem = (
      speditionOrder: SpeditionOrder,
      address: string,
      date: number,
      endDate: number,
    ): SpeditionOrderFeedItem => ({
      id: speditionOrder.id,
      type: isToLoading(speditionOrder) ? 'toLoad' : 'toUnload',
      orderId: speditionOrder.orderId,
      address,
      contractor: speditionOrder.contractor && {
        id: speditionOrder.contractor.id,
        name: speditionOrder.contractor.name,
      },
      date,
      endDate,
    });

    const isForToday = (date: moment.Moment, endDate: moment.Moment) =>
      today.isBetween(date, endDate, 'day', '[]');

    const isForTomorrow = (date: moment.Moment, endDate: moment.Moment) =>
      tomorrow.isBetween(date, endDate, 'day', '[]');

    const isLate = (endDate: moment.Moment) => today.isAfter(endDate, 'day');

    const isToLoading = (speditionOrder: SpeditionOrder) =>
      speditionOrder.status === 'CREATED';

    const isToUnloading = (speditionOrder: SpeditionOrder) =>
      speditionOrder.status === 'LOADED';

    const initValue: SpeditionOrderFeed = {
      forToday: [],
      forTomorrow: [],
      late: [],
    };

    return allOrders
      .filter((order) => {
        if (isToLoading(order)) {
          const { loading } = order;

          const date = moment(loading.date);
          const endDate = moment(loading.endDate);

          return (
            isForToday(moment(date), endDate) ||
            isForTomorrow(date, endDate) ||
            isLate(endDate)
          );
        }
        if (isToUnloading(order)) {
          const { unloading } = order;

          const date = moment(unloading.date);
          const endDate = moment(unloading.endDate);

          return (
            isForToday(date, endDate) ||
            isForTomorrow(date, endDate) ||
            isLate(endDate)
          );
        }
      })
      .reduce((acc, order) => {
        const handleSpeditionOrderFeed = (item: {
          address: string;
          date: number;
          endDate: number;
        }) => {
          const feedItem = buildItem(
            order,
            item.address,
            item.date,
            item.endDate,
          );

          const date = moment(item.date);
          const endDate = moment(item.endDate);

          if (isForToday(date, endDate)) {
            acc.forToday.push(feedItem);
          }

          if (isForTomorrow(date, endDate)) {
            acc.forTomorrow.push(feedItem);
          }

          if (isLate(endDate)) {
            acc.late.push(feedItem);
          }

          return acc;
        };

        if (isToLoading(order)) {
          return handleSpeditionOrderFeed(order.loading);
        }

        if (isToUnloading(order)) {
          return handleSpeditionOrderFeed(order.unloading);
        }

        return acc;
      }, initValue);
  }
}
