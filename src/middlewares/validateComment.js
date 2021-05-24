const { commentValidation } = require("../schemaValidations/comment");

const validateComment = async (req, res, next) => {
  try {
    await commentValidation.validate(req.body, { abortEarly: false });

    next();
  } catch (err) {
    console.error(err);

    const errors = [];
    err.inner.forEach(e => {
      errors.push({
        path: e.path,
        message: e.message,
      });
    });

    res.status(400).json({ errors });
  }
};

module.exports = validateComment;
