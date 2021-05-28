const express = require("express");
const connection = require("../db/connection");
const router = express.Router();
const auth = require("../middlewares/auth");
const validateComment = require("../middlewares/validateComment");

//@route POST postComment
//@desc  Post postComment to db
router.post("/", auth, validateComment, (req, res) => {
  const { commentDetails = "", postId = "", userId = "" } = req.body;

  connection.query(
    "insert into postComments (postId, userId, commentDetails) values (?, ?, ?); select * from users join postComments p on p.userId = users.id;",
    [postId, userId, commentDetails],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      const comments = rows[1].map(comment => {
        delete comment.email;
        delete comment.password;
        return comment;
      });

      res.status(201).json(comments);
    }
  );
});

//@route GET postComments
//@desc  Retrieve all postComments
router.get("/", auth, (req, res) => {
  connection.query(
    "select * from users join postComments p on p.userId = users.id;",
    (err, rows) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      }

      const comments = rows.map(comment => {
        delete comment.email;
        delete comment.password;
        return comment;
      });
      res.json(comments);
    }
  );
});

//@route DELETE comment
//@desc Delete a comment
router.delete("/:id", auth, (req, res) => {
  connection.query(
    "select * from postComments where userId = ? and id = ?;",
    [req.id, req.params.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      if (!rows.length) {
        return res
          .status(400)
          .json({ error: "Can't delete a comment that you never created" });
      }
      connection.query(
        "delete from postComments where id = ?;",
        [req.params.id],
        err => {
          if (err) {
            console.error(err);
            return res.sendStatus(500);
          }
          res.sendStatus(204);
        }
      );
    }
  );
});

module.exports = router;
