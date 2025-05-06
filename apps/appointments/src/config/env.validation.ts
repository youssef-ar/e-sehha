import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
  APPOINTMENTS_QUEUE: Joi.string().required(),
  PORT: Joi.number().default(3001),
});
