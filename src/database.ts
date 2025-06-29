import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

export const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
}).promise();  