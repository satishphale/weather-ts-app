import { Weather } from '../models/weather.model';
import { fetchWeatherByUserId, insertWeatherData } from '../repositories/weather.repository';

export const getWeatherByUserId = async (userId: number): Promise<Weather[]> => {
  return await fetchWeatherByUserId(userId);
};

export const saveWeatherData = async (weather: Weather, userId: number): Promise<Weather> => {
  const timestamp = new Date();
  const { insertId } = await insertWeatherData(weather, userId);

  return {
    id: insertId,
    rain: weather.rain,
    userId,
    timestamp,
  };
};
