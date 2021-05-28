const jwt = require("jsonwebtoken");

const generateAuthToken = id => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 86400,
  });

  return token;
};

module.exports = generateAuthToken;
