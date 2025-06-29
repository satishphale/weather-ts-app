import { pool } from './database';

export async function initDB() {

  await pool.query(`CREATE TABLE IF NOT EXISTS weather_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userid INT NOT NULL,
      rain Boolean,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  }
    

