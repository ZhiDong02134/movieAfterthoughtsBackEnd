const yup = require("yup");

const postValidation = yup.object({
  rating: yup
    .number("Rating must be a number")
    .min(0, "Rating must be a number between 0 and 10")
    .max(10, "Rating must be a number between 0 and 10")
    .integer("Rating must be a whole number")
    .required("Rating is required!"),
  postDetails: yup
    .string()
    .min(150, "Post must be at least 150 characters long")
    .max(400, "Post can't be more than 400 characters")
    .required("Post is required!"),
});

module.exports = {
  postValidation,
};
