import pg from 'pg';
const { Client } = pg; 

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in the parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });


// define postgres client 
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const userId = 6561405;
const bearerToken = `Bearer 1002~VKMLKOd8RyOFeGqwGOYJGjUdRX3Vnah8u4LUqd7RFFBO9H1EiQw93b1sGdxeBraa`;

// Connect to the database
async function connectClient() {
  try {
    await client.connect();
  } catch (e) {
    console.error('Failed to connect to the database', e.stack);
  }
}

// SQL SELECT: search existing database records for user registration
async function registrationStatus(id) {
  try { // try the following until success/failure
    const result = await client.query(
      `SELECT user_id FROM users
      WHERE user_id = $1`, [id]
    ); // try querying the table we made
    return result;
  } catch (e) { // if the query returns an error, do the following
    console.error(e.stack);
  }
}

// register a user within our Postgresql database
async function registerUser(id, token) {
  // fetch user data using Canvas API
  const response = await fetch(`https://canvas.oregonstate.edu/api/v1/users/${id}/profile`, {
    headers: {Authorization: `${token}`}
  });
  const data = await response.json(); // convert response to json
  // extract the specific JSON data values we want
  const first_name = data['short_name'].split(' ')[0];
  const last_name = data['short_name'].split(' ')[1];
  const email = data['primary_email'];

  // SQL INSERT QUERY: insert user data into postgresql database
  await client.query(`INSERT INTO users (user_id, first_name, last_name, email)
  VALUES ($1, $2, $3, $4)`, [id, first_name, last_name, email]);
}

// packaged code for jest mockups & unit testing
export default async function registration(userId, bearerToken) {
  try {
    // connect to database
    await connectClient();

    // check user registration status, then register if necessary
    const result = await registrationStatus(userId);
    // If the user has not already been registered
    if (result && result.rows.length === 0) {
      await registerUser(userId, bearerToken); // Register the user
    } else {
      return 'User already registered.';
    }
  } catch (error) {
    return error; // log any errors
  } finally {
    await client.end();
  }
}