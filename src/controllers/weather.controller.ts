import { Request, Response } from "express";
import { Weather } from "../models/weather.model";
import { getWeatherByUserId } from "../services/weather.service";
import { saveWeatherData } from "../services/weather.service";


export const getAllWeather = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.headers['x-userid']);
    if (!userId) {
       res.status(400).json({ error: 'Missing or invalid user ID in headers' });
       return;
    }

    const rows: Weather[] = await getWeatherByUserId(userId);

    if (!rows || rows.length === 0) {
       res.status(404).json({ message: 'No weather data found for user' });
       return;
    }

    const weatherData: Pick<Weather, 'rain' | 'timestamp'>[] = rows.map(({ rain, timestamp }) => ({
      rain,
      timestamp
    }));

     res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error in getAllWeather:', error);
     res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

export const createWeather = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.headers['x-userid']);
    if (!userId) {
       res.status(400).json({ error: 'Missing or invalid user ID in headers' });
       return;
    }

    const weather: Weather = req.body;
    if (weather.rain === undefined || weather.rain === null) {
       res.status(400).json({ error: 'Missing required field: rain' });
       return;
    }

    const inserted = await saveWeatherData(weather, userId);
    res.status(201).json(inserted);
  } catch (error) {
    console.error('Error in createWeather:', error);
    res.status(500).json({ error: 'Failed to save weather data' });
  }
};
