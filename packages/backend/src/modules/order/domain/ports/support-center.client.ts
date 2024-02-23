export interface OpenTicket {
  url: string;
  title: string;
}
export abstract class ISupportCenterClient {
  abstract getOpenTickets(email: string): Promise<OpenTicket[]>;
}
