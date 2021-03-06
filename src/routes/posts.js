const express = require("express");
const connection = require("../db/connection");
const router = express.Router();
const auth = require("../middlewares/auth");
const validatePost = require("../middlewares/validatePost");

//@route POST post
//@desc  Post post to db
router.post("/", auth, validatePost, (req, res) => {
  const {
    title = "",
    movieId = "",
    overallRating = "",
    releaseDate = "",
    rating = "",
    postDetails = "",
    posterSrc = "",
  } = req.body;

  connection.query(
    "insert into movies (id, title, releaseDate, overallRating, posterSrc) values (?, ?, ?, ?, ?) on duplicate key update id = id; insert into posts (postDetails, movieId, rating, userId) values (?, ?, ?, ?); select posts.id as id, updatedAt, postDetails, rating, movieId, userId, title, releaseDate, posterSrc, overallRating, firstName, lastName from posts join movies on posts.movieId = movies.id join users on posts.userId = users.id order by createdAt desc;",
    [
      movieId,
      title,
      releaseDate,
      overallRating,
      posterSrc,
      postDetails,
      movieId,
      rating,
      req.id,
    ],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      const posts = rows[2];

      res.status(201).json(posts);
    }
  );
});

//@route PATCH post
//@desc  Edit post
router.patch("/:id", auth, validatePost, (req, res) => {
  const { rating = "", postDetails = "" } = req.body;
  const postId = req.params.id;
  connection.query(
    "select * from posts where userId = ? and id = ?;",
    [req.id, postId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      if (!rows.length) {
        return res
          .status(400)
          .json({ error: "Can't edit a post that you never created" });
      }
      connection.query(
        "update posts set postDetails = ?, rating = ? where id = ?; select * from posts where id = ?;",
        [postDetails, rating, postId, postId],
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.sendStatus(500);
          }

          const updatedPost = rows[1];
          res.status(200).json(updatedPost);
        }
      );
    }
  );
});

//@route GET post
//@desc Retrieve all posts
router.get("/", auth, (req, res) => {
  connection.query(
    "select posts.id as id, updatedAt, postDetails, rating, movieId, userId, title, releaseDate, posterSrc, overallRating, firstName, lastName from posts join movies on posts.movieId = movies.id join users on posts.userId = users.id order by updatedAt desc;",
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      res.json(rows);
    }
  );
});

//@route POST post
//@desc Like post
router.post("/like/:postId", auth, (req, res) => {
  const { postId } = req.params;

  connection.query(
    "insert into likes (postId, userId) values (?, ?); select * from likes;",
    [postId, req.id],
    (err, rows) => {
      if (err) {
        if (err.sqlMessage.split(" ")[0] === "Duplicate") {
          return res.status(401).json({ error: "Post already liked." });
        }
        console.log(err);
        return res.sendStatus(500);
      }
      const likes = rows[1];

      res.status(200).json(likes);
    }
  );
});

//@route DELETE posts/like
//@desc delete like
router.delete("/unlike/:postId", auth, (req, res) => {
  const { postId } = req.params;

  connection.query(
    "delete from likes where postId = ? and userId = ?; select * from likes;",
    [postId, req.id],
    (err, rows) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      if (rows[0].affectedRows === 0) {
        return res.json({ error: "Please like post first" });
      }
      const likes = rows[1];

      res.status(200).json(likes);
    }
  );
});

//@route GET posts/likes
//@desc get all likes
router.get("/likes", auth, (req, res) => {
  connection.query("select * from likes;", (err, rows) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    const likes = rows;

    res.status(200).json(likes);
  });
});

//@route DELETE post
//@desc Delete a post
router.delete("/:id", auth, (req, res) => {
  connection.query(
    "select * from posts where userId = ? and id = ?;",
    [req.id, req.params.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      if (!rows.length) {
        return res
          .status(400)
          .json({ error: "Can't delete a post that you never created" });
      }
      connection.query(
        "delete from posts where id = ?;",
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
