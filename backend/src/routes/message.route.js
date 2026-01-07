import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForChat,
  getMessages,
} from "../controllers/message.controller.js";
import upload from "../middleware/upload.js";
import { sendMessage } from "../controllers/message.controller.js";
const router = express.Router();
router.get("/users", protectRoute, getUsersForChat);
router.get("/:id", protectRoute, getMessages);
router.post(
  "/send/:id",
  protectRoute,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  sendMessage
);

export default router;
