import mqtt from 'mqtt';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { handleMQTTMessage } from './handleMQTTMessage';

let client: mqtt.MqttClient;
const mqttBroket = 'mqtt://192.168.1.40:1883';

function generateCombinedTopics() {
  const devices = ['1', '2', '3'];
  const parameters = ['E', 'V', 'P', 'I'];
  const topicArr: string[] = [];
  devices.forEach((device) => {
    parameters.forEach((parameter) => {
      const topicToSubscribe = `${parameter}/${device}`;
      topicArr.push(topicToSubscribe);
    });
  });
  return topicArr;
}

function setupMqtt(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) {
  client = mqtt.connect(mqttBroket);
  const topicsToSubscribe = generateCombinedTopics();
  console.log('🚀 topicsToSubscribe:', topicsToSubscribe);

  client.on('connect', () => {
    console.log('Connected to MQTT broker');

    topicsToSubscribe.forEach((topicToSubscribe) => {
      client.subscribe(topicToSubscribe, (error) => {
        if (!error) {
          console.log(`Subscribed to ${topicToSubscribe}`);
        } else {
          console.error(`Subscription failed for ${topicToSubscribe}`, error);
        }
      });
    });
  });

  client.on('message', async (topic, message) => {
    console.log(topic);
    await handleMQTTMessage(topic, message, io);
  });
}

export { setupMqtt };
