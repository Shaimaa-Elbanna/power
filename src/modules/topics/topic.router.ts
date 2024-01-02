import { Router } from 'express';

import { getTopicsData, getTopicsDataById } from './topic.controller';

const topicsRouter = Router();

topicsRouter.get('/', getTopicsData);
topicsRouter.get('/:id', getTopicsDataById);

export { topicsRouter };
