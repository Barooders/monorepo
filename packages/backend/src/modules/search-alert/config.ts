export enum QueueNames {
  SEARCH_ALERT_QUEUE_NAME = 'search-alert-queue',
}

export type QueuePayload = {
  [QueueNames.SEARCH_ALERT_QUEUE_NAME]: {
    alertId: string;
  };
};
