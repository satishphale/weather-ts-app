import express from 'express';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weather.routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/', weatherRoutes);

export default app;
