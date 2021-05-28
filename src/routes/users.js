const express = require("express");
const bcrypt = require("bcryptjs");

const validateReg = require("../middlewares/validateReg");
const validateLogin = require("../middlewares/validateLogin");
const generateAuthToken = require("../utils/genAuthToken");
const auth = require("../middlewares/auth");
const connection = require("../db/connection");

const router = express.Router();

//@route  POST users
//@desc   Register User
//@access public
router.post("/register", validateReg, async (req, res) => {
  const { firstName = "", lastName = "", email = "", password = "" } = req.body;

  const hashedPassword = await bcrypt.hash(password, 8);

  connection.query(
    "insert into users (firstName, lastName, email, password) values (?, ?, ?, ?); select * from users where email = ?;",
    [firstName, lastName, email, hashedPassword, email],
    (err, rows) => {
      if (err) {
        if (err.sqlMessage.split(" ")[0] === "Duplicate") {
          return res
            .status(401)
            .json({ error: "Email already registered, please log in." });
        }
        console.log(err);
        return res.sendStatus(500);
      }

      const user = rows[1][0];

      const token = generateAuthToken(user.id);

      delete user.password;

      res.status(201).send({
        ...user,
        token,
      });
    }
  );
});

//@route  POST users
//@desc   Login User
//@access public
router.post("/login", validateLogin, (req, res) => {
  const { email = "", password = "" } = req.body;

  connection.query(
    "select * from users where email = ?",
    [email],
    (err, rows) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (!rows.length) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }

      const user = rows[0];

      const storedPw = user.password;

      const match = bcrypt.compareSync(password, storedPw);

      if (!match) {
        return res.status(400).send({ error: "Invalid Credentials" });
      }

      const token = generateAuthToken(user.id);

      delete user.password;

      res.status(200).send({
        ...user,
        token,
      });
    }
  );
});

//@route  Deleted users
//@desc   Delete User
router.delete("/:id", auth, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (req.id !== userId) {
    return res
      .status(400)
      .json({ error: "User can only delete their own account." });
  }
  connection.query("delete from users where id = ?;", [userId], err => {
    if (err) {
      return res.sendStatus(500);
    }

    res.sendStatus(204);
  });
});

module.exports = router;
