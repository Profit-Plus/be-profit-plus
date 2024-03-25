import { Router } from 'express';
const picRouter = Router();
import { createPicController } from '../../controllers/projectMonitoring/picController';

picRouter.post('/monitoring/pic', createPicController);

export default picRouter;