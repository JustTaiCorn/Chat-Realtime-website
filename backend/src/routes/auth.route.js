import express from "express";
import {
  checkAuth,
  facebookAuth,
  googleAuthCallback,
  login,
  logout,
  refreshToken,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import passport from "passport";
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/refresh", refreshToken);

router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePicture"),
  updateProfile
);
router.get("/check-auth", protectRoute, checkAuth);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/login",
    session: false,
  }),
  googleAuthCallback
);
router.get("/facebook", facebookAuth);
export default router;
