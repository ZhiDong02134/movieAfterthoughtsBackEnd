const express = require("express");
const auth = require("../middlewares/auth");
const connection = require("../db/connection");
const generateAuthToken = require("../utils/genAuthToken");

const router = express.Router();

//keeps user logged in even if they refresh page
router.get("/", auth, (req, res) => {
  connection.query(
    "select * from users where id = ?",
    [req.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      if (!rows.length) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
      const user = rows[0];

      delete user.password;
      const token = generateAuthToken(req.id);

      res.status(200).send({
        ...user,
        token,
      });
    }
  );
});

module.exports = router;
