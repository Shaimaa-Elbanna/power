import { Document } from 'mongoose';

export interface ITopic extends Document {
  deviceId?: string;
  data: TopicsData[];
}
interface TopicsData {
  // topic: string;
  // value: number;
  E: number;
  V: number;
  I: number;
  P: number;
  time: Date;
}
