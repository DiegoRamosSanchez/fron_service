export interface Conversation {
  id?: number;
  userId: number;
  title?: string | null;
  startTime?: Date;
  endTime?: Date;
  active?: string;
}