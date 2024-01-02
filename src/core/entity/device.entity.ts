import { Document } from 'mongoose';

export interface IDevice extends Document {
  name: string;
}
