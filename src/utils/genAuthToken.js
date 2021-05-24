const jwt = require("jsonwebtoken");

const generateAuthToken = id => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 60 * 600,
  });

  return token;
};

module.exports = generateAuthToken;
