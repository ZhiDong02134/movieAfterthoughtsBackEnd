const yup = require("yup");

const registerationValidation = yup.object({
  firstName: yup
    .string()
    .min(2, "First name is too short!")
    .required("First name is required!"),
  lastName: yup
    .string()
    .min(2, "Last name is too short!")
    .required("Last name is required!"),
  email: yup
    .string()
    .lowercase()
    .email("Email is not valid")
    .required("Email is required!"),
  password: yup
    .string()
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password be at least 8 characters longs, containing at least one lowercase charater, one uppercase character, one digit and one special character"
    )
    .required("Password is required!"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Password do not match")
    .required(),
});

const loginValidation = yup.object({
  email: yup
    .string()
    .lowercase()
    .email("Email is not valid")
    .required("Email is required!"),
  password: yup
    .string()
    .min(8, "Invalid Password!")
    .required("Password is required!"),
});

module.exports = {
  registerationValidation,
  loginValidation,
};
