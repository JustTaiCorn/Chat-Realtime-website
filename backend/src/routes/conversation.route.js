import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    createConversation,
    getConversation,
    getMessages, markAsSeen
} from "../controllers/conversation.controller.js";
import {checkFriend} from "../middleware/friend.middleware.js";
const router = express.Router();

router.post("/", protectRoute,checkFriend, createConversation);

router.get("/:conversationId", protectRoute, getConversation);

router.get("/:conversationId/messages", protectRoute, getMessages);

router.patch("/:conversationId/seen", protectRoute, markAsSeen);
export default router;