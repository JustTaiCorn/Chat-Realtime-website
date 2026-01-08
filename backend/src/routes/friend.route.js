import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getAllFriends,getFriendRequests
} from "../controllers/friend.controller.js";
const router = express.Router();

router.post("/requests",protectRoute, sendFriendRequest);
router.post("/requests/:requestId/accept",protectRoute, acceptFriendRequest);
router.post("/requests/:requestId/decline",protectRoute, declineFriendRequest);

router.get("/",protectRoute, getAllFriends);
router.get("/requests",protectRoute, getFriendRequests);

export default router;