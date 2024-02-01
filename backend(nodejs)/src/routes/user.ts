import express from "express";
const router = express.Router();

import { signup, signin, getAll, getOne, getUserContactsAndLastMessage, search, addToContacts } from "../controllers/users/userController";
import { authorize } from "../middlewares/auth/auth";
import {
  createUserValidator,
  signinValidator,
} from "../middlewares/validator/userValidator";

// @desc create a new user router
router.post("/signup/", createUserValidator, signup);
router.post("/signin/", signinValidator, signin);
router.get("/", getAll);

// @desc get all users
router.get("/me", authorize, getOne);

// get all contacts
router.get("/contacts", authorize, getUserContactsAndLastMessage);


router.get("/search", authorize, search);

router.get("/contacts/:id", authorize, addToContacts);


export default router;
