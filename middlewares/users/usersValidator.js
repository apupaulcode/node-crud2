// external imports
const { validationResult, check } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs").promises;

// internal imports
const User = require('../../model/People')

// add user
const addUserValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError("Mobile already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];

const addUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // remove uploaded files
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    // response the errors
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};



// const addUserValidationHandler = async function (req, res, next) {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     // If there are no validation errors, proceed to the next middleware
//     return next();
//   } else {
//     // If there are validation errors
//     // Remove uploaded files (if any)
//     if (req.files && req.files.length > 0) {
//       try {
//         const { filename } = req.files[0];
//         await unlink(path.join(__dirname, `/../public/uploads/avatars/${filename}`));
//       } catch (err) {
//         console.error("Error deleting uploaded file:", err);
//         // Continue even if file deletion fails
//       }
//     }

//     // Respond with validation errors
//     res.status(400).json({ errors: errors.array() });
//   }
// };



module.exports = {
  addUserValidators,
  addUserValidationHandler,
};