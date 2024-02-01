import { check } from "express-validator";
import validatorMiddeleware from "./validatorResult";

const sendMessageValidator = [
  check("content").notEmpty().withMessage("content is required"),
  check("to").notEmpty(),

  validatorMiddeleware,
];

export { sendMessageValidator };
