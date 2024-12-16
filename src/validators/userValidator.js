const { validationResult, check } = require("express-validator");

exports.loginValidator = [
  check("email").isEmail().withMessage("Valid email required"),
  check("password").notEmpty().withMessage("Please enter password"),
];

exports.registerValidator = [
  check("firstname").notEmpty().withMessage("Fistname required"),
  check("lastname").notEmpty().withMessage("Lastname required"),
  check("email").isEmail().withMessage("Valid email required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("ekno").notEmpty().withMessage("ekno required"),
  check("division").notEmpty().withMessage("division required"),
  check("department").notEmpty().withMessage("department required"),
  check("role").notEmpty().withMessage("role required"),
  check("access").notEmpty().withMessage("access type required"),
  check("region").notEmpty().withMessage("region required"),
];

exports.registerAdminValidator = [
  check("firstname").notEmpty().withMessage("Fistname required"),
  check("lastname").notEmpty().withMessage("Lastname required"),
  check("email").isEmail().withMessage("Valid email required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("ekno").notEmpty().withMessage("ekno required"),
  check("division").notEmpty().withMessage("division required"),
  check("department").notEmpty().withMessage("department required"),
  check("role").notEmpty().withMessage("role required"),
  check("access").notEmpty().withMessage("access type required"),
  check("region").notEmpty().withMessage("region required"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({
      errors: errors.array()[0].msg,
    });
  }
  next();
};
