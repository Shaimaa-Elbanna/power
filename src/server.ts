import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

import { dbConnection } from './core/dbConnection';
import * as mqttController from './modules/setupMqtt/setupMqtt.controller';
import { topicsRouter } from './modules/topics/topic.router';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.resolve(__dirname, '../../client/dist')));

const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});
// const sendData = async (topic: string, mess: any) => {
//   io.emit(topic, mess);
// };

// io.on('connection', () => {
//   console.log('A user connected');

//   setInterval(() => {
//     sendData('mqttMessage', new Date());
//   }, 1000); // Emit every second (1000 milliseconds)
// });

// io.on('connection', () => {
//   mqttController.setupMqtt(io);
// });

httpServer.listen(4000);

const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:4000',
];
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use('/topic', topicsRouter);

mqttController.setupMqtt(io);

dbConnection();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
