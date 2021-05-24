const yup = require("yup");

const commentValidation = yup.object({
  commentDetails: yup
    .string()
    .min(5, "Comment must be at least 5 characters long")
    .max(250, "Comment can't be more than 250 characters")
    .required("Comment is required!"),
});

module.exports = {
  commentValidation,
};
