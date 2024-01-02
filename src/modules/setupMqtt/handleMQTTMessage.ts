import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { deviceModel } from '../../core/mongo-models/deviceModel';
import { topicMoeld } from '../../core/mongo-models/topicModel';

function emitMQTTMessage(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  parameter: string,
  deviceName: string,
  message: Buffer,
) {
  io.emit('mqttMessage', {
    parameter,
    deviceName,
    message: message.toString(),
  });
}

export async function handleMQTTMessage(
  topic: string,
  message: Buffer,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) {
  console.log(` string message:${topic}: ${message.toString()}`);
  console.log(`${topic}: ${message}`);
  console.log(`${typeof topic}: ${typeof message}`);
  console.log(`${topic.length}`);
  // const mqttData = JSON.parse(message.toString());
  try {
    const topicPairs = topic.split('/');
    if (topicPairs.length == 2) {
      const parameter = topicPairs[0];
      const deviceName = topicPairs[1];

      const device = await deviceModel.findOne({ name: deviceName });

      if (!device) {
        return await deviceModel.create({ name: deviceName });
      }

      const dataToUpdate = {
        [parameter]: message,
        time: new Date(),
      };

      const createTopic = await topicMoeld.findOneAndUpdate(
        { deviceId: device._id },
        {
          $push: {
            data: dataToUpdate,
          },
        },
        { new: true, upsert: true },
      );
      console.log(
        '🚀 ~ file: handleMQTTMessage.ts:39 ~ handleMQTTMessage ~ createTopic:',
        createTopic,
      );
      emitMQTTMessage(io, parameter, deviceName, message);
    } else {
      console.log('Invalid topic format:', topic);
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
}
