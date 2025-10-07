export interface Message {
  id?: number;
  conversationId: number;
  query: string;
  response: string;
  sentAt?: Date;
  active?: string;
}