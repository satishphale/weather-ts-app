CREATE DATABASE IF NOT EXISTS weather_db;
USE weather_db;

CREATE TABLE IF NOT EXISTS weather (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(100),
  temperature FLOAT,
  description VARCHAR(255),
  date DATE
);
