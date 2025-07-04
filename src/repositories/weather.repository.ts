import { pool } from '../database';
import { Weather } from '../models/weather.model';

export const fetchWeatherByUserId = async (userId: number): Promise<Weather[]> => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM weather_data WHERE userid = ?', [userId]);
    return rows;
  } catch (error) {
    console.error(`Error fetching weather data for userId=${userId}:`, error);
    throw new Error('Database query failed while fetching weather data.');
  }
};

export const insertWeatherData = async (weather: Weather, userId: number): Promise<{ insertId: number }> => {
  try {
    const timestamp = new Date();
    const [result]: any = await pool.query(
      'INSERT INTO weather_data (rain, userid, timestamp) VALUES (?, ?, ?)',
      [weather.rain, userId, timestamp]
    );

    return { insertId: result.insertId };
  } catch (error) {
    console.error(`Error inserting weather data for userId=${userId}:`, error);
    throw new Error('Database insert failed while saving weather data.');
  }
};
