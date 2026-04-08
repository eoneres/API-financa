const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db';

jest.setTimeout(10000);