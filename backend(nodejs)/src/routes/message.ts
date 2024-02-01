import express from "express";
const router = express.Router();

import { sendMessage, getAllMessages, setMessagesStatus } from "../controllers/messages/message";
import { authorize } from "../middlewares/auth/auth";
import { sendMessageValidator } from "../middlewares/validator/messageValidator";

router.post("/send/", authorize, sendMessageValidator, sendMessage);
router.get("/:id", authorize, getAllMessages);

router.get("/status/:id", authorize, setMessagesStatus);



export default router;