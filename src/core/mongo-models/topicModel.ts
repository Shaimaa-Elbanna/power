import { Model, model, Schema, Types } from 'mongoose';

import { ITopic } from '../entity/topics.entity';

const topicSchema: Schema<ITopic> = new Schema({
  deviceId: {
    type: Types.ObjectId,
    ref: 'Device',
    required: true,
    unique: true,
  },

  data: [
    {
      E: Number,
      V: Number,
      I: Number,
      P: Number,
      time: {
        type: Date,
        default: Date.now,
        required: true,
      },
    },
  ],
});

const topicMoeld: Model<ITopic> = model('Topic', topicSchema);
export { topicMoeld };
