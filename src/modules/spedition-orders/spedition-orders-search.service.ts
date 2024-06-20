import MiniSearch from 'minisearch';
import { Injectable } from '@nestjs/common';

import { SpeditionOrder } from './entities/spedition-order.entity';

@Injectable()
export class SpeditionOrdersSearchService {
  private searchEngine: MiniSearch;

  constructor() {
    this.searchEngine = this.buildSearchEngine();
  }

  searchOrders(
    speditionOrders: Array<SpeditionOrder>,
    query: string,
  ): Array<SpeditionOrder> {
    this.searchEngine.removeAll();

    this.searchEngine.addAll(speditionOrders);

    const results = this.searchEngine.search(query);
    const foundIds = new Set(results.map(({ id }) => id));

    return speditionOrders.filter(({ id }) => foundIds.has(id));
  }

  private buildSearchEngine() {
    return new MiniSearch({
      fields: [
        'loading.address',
        'loading.loadingNumber',
        'loading.additionalInfo',
        'unloading.address',
        'unloading.unloadingNumber',
        'unloading.additionalInfo',
        'additionalInfo',
        'contractor.name',
        'driver.name',
        'vehicle.carLicensePlate',
        'vehicle.trailerLicensePlate',
        'creator.name',
      ],
      storeFields: ['id'],
      extractField: (document, fieldName) => {
        if (fieldName === 'id') {
          return document.id;
        }
        if (fieldName.includes('.')) {
          const [key, attribute] = fieldName.split('.');
          const object = document[key];

          return object ? object[attribute] : '';
        }
        return MiniSearch.getDefault('extractField');
      },
      tokenize: (text) => text.toLowerCase().split(' '),
      searchOptions: {
        prefix: true,
      },
    });
  }
}
