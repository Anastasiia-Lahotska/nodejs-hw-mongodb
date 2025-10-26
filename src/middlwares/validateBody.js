import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(createHttpError(400, error.details.map(d => d.message).join(', ')));
  }
  next();
};