// Configure DATABASE_URL pour les tests Jest

import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;