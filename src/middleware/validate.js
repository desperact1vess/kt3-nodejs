function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: 'Проверьте поля',
        details: error.details.map((item) => item.message)
      });
    }
    req.body = value;
    next();
  };
}

module.exports = validate;
