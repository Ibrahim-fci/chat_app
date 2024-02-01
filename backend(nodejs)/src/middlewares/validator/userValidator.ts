import { check } from "express-validator";
import validatorMiddeleware from "./validatorResult";

const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("username is required")
    .isString()
    .withMessage("name must be string"),
  check("email").isEmail().withMessage("must be valid email"),
  check("password")
    .isLength({ min: 6, max: 12 })
    .withMessage("must more than 6 char"),

  validatorMiddeleware,
];

const signinValidator = [
  check("email").isEmail().withMessage("must be valid email"),
  check("password")
    .isLength({ min: 6, max: 12 })
    .withMessage("must more than 6 char"),

  validatorMiddeleware,
];

export { createUserValidator, signinValidator };
