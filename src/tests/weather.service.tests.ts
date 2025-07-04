import { getWeatherByUserId, saveWeatherData } from '../services/weather.service';
import { pool } from '../database';
import { Weather } from '../models/weather.model';

jest.mock('../database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Weather Service', () => {
  const mockUserId = 101;

  describe('getWeatherByUserId', () => {
    it('should return weather data for a user', async () => {
      const mockData: Weather[] = [
        { id: 1, rain: true, timestamp: new Date('2024-01-01T00:00:00.000Z'), userId: mockUserId }
      ];

      (pool.query as jest.Mock).mockResolvedValue([mockData]);

      const result = await getWeatherByUserId(mockUserId);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM weather_data WHERE userid = ?',
        [mockUserId]
      );
      expect(result).toEqual(mockData);
    });

    it('should throw an error if query fails', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(getWeatherByUserId(mockUserId)).rejects.toThrow(
        'Database query failed while fetching weather data.'
      );
    });
  });

  describe('saveWeatherData', () => {
    const inputWeather: Weather = {
      id: 0, // ignored during insert
      rain: false,
      timestamp: new Date(''), // filled during insert
      userId: mockUserId
    };

    it('should insert and return weather data', async () => {
      const mockInsertId = 42;
      const mockTime = new Date();

      jest.spyOn(global, 'Date').mockImplementation(() => mockTime as any);

      (pool.query as jest.Mock).mockResolvedValue([{ insertId: mockInsertId }]);

      const result = await saveWeatherData(inputWeather, mockUserId);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO weather_data (rain, userid, timestamp) VALUES (?, ?, ?)',
        [inputWeather.rain, mockUserId, mockTime]
      );

      expect(result).toEqual({
        id: mockInsertId,
        rain: inputWeather.rain,
        userId: mockUserId,
        timestamp: mockTime
      });
    });

    it('should throw an error if insert fails', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('Insert failed'));

      await expect(saveWeatherData(inputWeather, mockUserId)).rejects.toThrow(
        'Database insert failed while saving weather data.'
      );
    });
  });
});
