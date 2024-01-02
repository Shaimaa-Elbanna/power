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

const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
  },
});

io.on('connection', () => {
  console.log('A user connected');
});

app.use(cors(corsOptions));

app.use('/topic', topicsRouter);

mqttController.setupMqtt(io);

dbConnection();

httpServer.listen(port, () => {
  console.log(`Server & socketio is running on port ${port}`);
});

// httpServer.listen(port, () => {
//   console.log('socket io lisining on 3000');
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// +>>>> both of the above lines must not exist

// here i had an error as when connecting sockt io with express server both are connected and both are now httpServer and linstingng at the same port
// im not treet them individually as both are now the same
