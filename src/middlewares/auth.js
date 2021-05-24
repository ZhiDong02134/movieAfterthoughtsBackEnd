const jwt = require("jsonwebtoken");
const connection = require("../db/connection");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    connection.query(
      "select * from users where id = ?",
      [decoded.id],
      (err, rows) => {
        if (err) {
          return res.sendStatus(500);
        }
        if (!rows.length) {
          return res.status(401).json({
            error: "Unauthenticated",
          });
        }
      }
    );

    req.id = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthenticated" });
  }
};

module.exports = auth;
