import * as Joi from 'joi';

export const validationSchema = Joi.object({
  RABBITMQ_URL: Joi.string().required(),
  APPOINTMENTS_QUEUE: Joi.string().required(),
  PORT: Joi.number().default(3000),
});
