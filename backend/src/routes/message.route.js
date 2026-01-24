import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  sendDirectMessage,
  sendGroupMessage,
  toggleReaction,
  searchMessages,
} from "../controllers/message.controller.js";
import upload from "../middleware/upload.js";
import {
  checkFriend,
  checkGroupShip,
} from "../middleware/friend.middleware.js";
const router = express.Router();
router.get("/search", protectRoute, searchMessages);
router.post(
  "/direct",
  protectRoute,
  upload.single("image"),
  checkFriend,
  sendDirectMessage,
);
router.post(
  "/group",
  protectRoute,
  upload.single("image"),
  checkGroupShip,
  sendGroupMessage,
);
router.post("/:messageId/reactions", protectRoute, toggleReaction);

export default router;
