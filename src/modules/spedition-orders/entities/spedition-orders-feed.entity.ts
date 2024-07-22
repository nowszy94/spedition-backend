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
    nip: string;
    phoneNumber: string;
    email: string;
    contact?: {
      name: string;
      email: string;
      phoneNumber: string;
    };
  };
  date: number;
  endDate: number;
  elements: Array<{
    address: string;
    date: number;
    endDate: number;
    completed: boolean;
  }>;
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
