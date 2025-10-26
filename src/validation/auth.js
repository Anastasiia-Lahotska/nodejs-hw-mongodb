import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});