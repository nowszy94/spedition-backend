export type CheckedStatus =
  | 'toLoad'
  | 'toUnload'
  | 'toUnloadAndNotYetLoaded'
  | 'loaded'
  | 'unloaded';

export type SpeditionOrderFeedItem = {
  id: string;
  type: CheckedStatus;
  orderId: string;
  contractor?: {
    id: string;
    name: string;
  };
  address: string;
  date: number;
  endDate: number;
};

export type SpeditionOrderFeed = {
  forToday: Array<SpeditionOrderFeedItem>;
  forTomorrow: Array<SpeditionOrderFeedItem>;
  late: Array<SpeditionOrderFeedItem>;
};

export type SpeditionOrderFeedResponse = {
  loading: SpeditionOrderFeed;
  unloading: SpeditionOrderFeed;
};
