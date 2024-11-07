import mysql from 'mysql2/promise'
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.password,
    database: process.env.database
})


export default mysqlPool    