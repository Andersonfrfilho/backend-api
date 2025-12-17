import * as Joi from 'joi';

export default Joi.object({
  // ============================================
  // API Configuration
  // ============================================
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3333),
  BASE_URL: Joi.string().optional(),
  API_APP_CONTAINER_NAME: Joi.string().default('backend-api-service'),
  BASE_URL_DEVELOPMENT: Joi.string().default('http://localhost:3333'),
  BASE_URL_STAGING: Joi.string().default('https://api-hml.example.com'),
  BASE_URL_PRODUCTION: Joi.string().default('https://api-prod.example.com'),

  // ============================================
  // Database Configuration
  // ============================================
  DATABASE_POSTGRES_HOST: Joi.string().default('localhost'),
  DATABASE_POSTGRES_PORT: Joi.number().default(5432),
  DATABASE_POSTGRES_NAME: Joi.string().default('app_db'),
  DATABASE_POSTGRES_USER: Joi.string().default('postgres'),
  DATABASE_POSTGRES_PASSWORD: Joi.string().required(), // Obrigatório
  DATABASE_POSTGRES_SYNCHRONIZE: Joi.boolean().default(false),
  DATABASE_POSTGRES_LOGGING: Joi.boolean().optional(),
  DATABASE_POSTGRES_TIMEZONE: Joi.string().default('UTC'),

  // E2E Test Database Configuration
  DATABASE_POSTGRES_TEST_E2E_HOST: Joi.string().default('localhost'),
  DATABASE_POSTGRES_TEST_E2E_PORT: Joi.number().default(5433),
  DATABASE_POSTGRES_TEST_E2E_NAME: Joi.string().default('app_db_e2e'),
  DATABASE_POSTGRES_TEST_E2E_USER: Joi.string().default('postgres'),
  DATABASE_POSTGRES_TEST_E2E_PASSWORD: Joi.string().required(), // Obrigatório
  DATABASE_POSTGRES_TEST_E2E_SYNCHRONIZE: Joi.boolean().default(true),
  DATABASE_POSTGRES_TEST_E2E_LOGGING: Joi.boolean().optional(),
  DATABASE_POSTGRES_TEST_E2E_TIMEZONE: Joi.string().default('UTC'),
});
