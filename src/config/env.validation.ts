import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3333),
  API_APP_CONTAINER_NAME: Joi.string().default('backend-api-service'),
});
