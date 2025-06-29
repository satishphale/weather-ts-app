import { Router } from 'express';
import {
  getAllWeather,
  createWeather
} from '../controllers/weather.controller';

const router = Router();

router.get('/api/data', getAllWeather);
router.post('/api/data', createWeather);

export default router;
