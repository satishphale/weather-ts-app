import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { getAllWeather, createWeather } from '../controllers/weather.controller';
import * as weatherService from '../services/weather.service';
import { Weather } from '../models/weather.model';

const app = express();
app.use(bodyParser.json());
app.get('/weather', getAllWeather);
app.post('/weather', createWeather);

jest.mock('../services/weather.service');

describe('Weather Controller', () => {
  const mockUserId = 123;

  describe('GET /weather', () => {
    it('should return 400 if user ID header is missing', async () => {
      const res = await request(app).get('/weather');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing or invalid user ID in headers');
    });

    it('should return 404 if no weather data found', async () => {
      (weatherService.getWeatherByUserId as jest.Mock).mockResolvedValue([]);
      const res = await request(app).get('/weather').set('x-userid', mockUserId.toString());
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('No weather data found for user');
    });

    it('should return 200 and weather data if found', async () => {
      const mockData: Weather[] = [
        { id: 1, rain: true, timestamp: new Date('2024-01-01T00:00:00.000Z'), userId: mockUserId }
      ];
      (weatherService.getWeatherByUserId as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app).get('/weather').set('x-userid', mockUserId.toString());
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ rain: true, timestamp: '2024-01-01T00:00:00.000Z' }]);
    });

    it('should return 500 on internal error', async () => {
      (weatherService.getWeatherByUserId as jest.Mock).mockRejectedValue(new Error('DB error'));
      const res = await request(app).get('/weather').set('x-userid', mockUserId.toString());
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to fetch weather data');
    });
  });

  describe('POST /weather', () => {
    const weatherPayload = { rain: true, timestamp: '2024-01-01T00:00:00Z' };

    it('should return 400 if user ID header is missing', async () => {
      const res = await request(app).post('/weather').send(weatherPayload);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing or invalid user ID in headers');
    });

    it('should return 400 if rain is missing', async () => {
      const res = await request(app)
        .post('/weather')
        .set('x-userid', mockUserId.toString())
        .send({ timestamp: '2024-01-01T00:00:00Z' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing required field: rain');
    });

    it('should return 201 if data is saved successfully', async () => {
      const mockInserted = { id: 1, ...weatherPayload, userid: mockUserId };
      (weatherService.saveWeatherData as jest.Mock).mockResolvedValue(mockInserted);

      const res = await request(app)
        .post('/weather')
        .set('x-userid', mockUserId.toString())
        .send(weatherPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockInserted);
    });

    it('should return 500 on save error', async () => {
      (weatherService.saveWeatherData as jest.Mock).mockRejectedValue(new Error('DB error'));
      const res = await request(app)
        .post('/weather')
        .set('x-userid', mockUserId.toString())
        .send(weatherPayload);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to save weather data');
    });
  });
});
