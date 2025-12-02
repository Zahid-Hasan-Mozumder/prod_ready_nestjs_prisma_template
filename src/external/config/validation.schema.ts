import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // App Config
  PORT: Joi.number().default(3000),

  // Database Config
  DATABASE_URL: Joi.string().required(),
});