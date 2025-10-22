export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation error',
        details: error.details.map(detail => detail.message),
      });
    }
    next();
  };
};