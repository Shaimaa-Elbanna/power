import { Model, model, Schema } from 'mongoose';

import { IDevice } from '../entity/device.entity';

const deviceSchema: Schema<IDevice> = new Schema({
  name: {
    type: String,
    unique: true,

    require: true,
  },
});

const deviceModel: Model<IDevice> = model<IDevice>('Device', deviceSchema);
export { deviceModel };
