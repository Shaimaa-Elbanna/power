import { Request, Response } from 'express';

import { deviceModel } from '../../core/mongo-models/deviceModel';
import { topicMoeld } from '../../core/mongo-models/topicModel';

const getTopicsData = async (req: Request, res: Response) => {
  try {
    const { deviceName } = req.query;
    console.log('deviceName', deviceName);

    if (deviceName) {
      const device = await deviceModel.find({ name: deviceName });

      const topic = await topicMoeld.find({ deviceId: device[0]._id });

      res.json(topic);
    } else {
      const topics = await topicMoeld.find({}).populate({
        path: 'deviceId',
        select: 'name  ',
      });

      res.json(topics);
    }
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTopicsDataById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const topics = await topicMoeld.findById(id).populate({
      path: 'deviceId',
      select: 'name  ',
    });

    res.json(topics);
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { getTopicsData, getTopicsDataById };
