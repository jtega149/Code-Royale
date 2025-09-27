// backend/config/db.js
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL, // Heroku Database URL or local config
  ssl: {
    rejectUnauthorized: false, // Optional: Disables certificate validation for local dev
  },
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL', err.stack));

export default client;
