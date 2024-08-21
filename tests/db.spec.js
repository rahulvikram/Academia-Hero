import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in the parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// import postgres registration function
import { registration } from './postgres.js';
import { beforeEach } from 'node:test';

// import testing variables from environment
const userId = process.env.USERID;
const token = process.env.BEARERTOKEN;

// manual jest mockup for postgres
jest.mock('pg', () => {
    const mClient = { // mock implementation of postgresql w/ separate client methods
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    // whenever Client is called, it uses the mock client rather than the real one
    return { Client: jest.fn(() => mClient) };
});