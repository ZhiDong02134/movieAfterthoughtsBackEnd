const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const usersRouter = require("./routes/users");
const authorizeRouter = require("./routes/authorize");
const moviesRouter = require("./routes/movies");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

const app = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);
app.use("/authorize", authorizeRouter);
app.use("/movies", moviesRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

module.exports = app;
