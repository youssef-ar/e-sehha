import * as Joi from 'joi';

export const validationSchema = Joi.object({
  RABBITMQ_URL: Joi.string().required(),
  APPOINTMENTS_QUEUE: Joi.string().required(),
  NOTIFICATIONS_SERVICE_URL: Joi.string().default('http://localhost:3001'),
  PORT: Joi.number().default(3000),
});
