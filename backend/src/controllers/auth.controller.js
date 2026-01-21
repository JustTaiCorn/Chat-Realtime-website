import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import { storage, ID } from "../lib/appwrite.js";
import { InputFile } from "node-appwrite/file";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../lib/mail/emails.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days
const isProduction = process.env.NODE_ENV === "production";

// Cookie options based on environment
const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: REFRESH_TOKEN_TTL,
});

// Helper function to generate tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();

      // Generate tokens
      const accessToken = generateAccessToken(newUser._id);
      const refreshToken = generateRefreshToken();

      // Save session
      await Session.create({
        userId: newUser._id,
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
      });

      // Set refresh token in httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: REFRESH_TOKEN_TTL,
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        accessToken,
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken();
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    res.cookie("refreshToken", refreshToken, getCookieOptions());

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await Session.deleteOne({ refreshToken: token });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });
      return res.status(403).json({ message: "Refresh token expired" });
    }

    // Generate new access token
    const accessToken = generateAccessToken(session.userId);

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    try {
      const fileId = ID.unique();
      const file = req.file;

      const fileBuffer = file.buffer;
      const fileName = file.originalname;

      const uploadedFile = await storage.createFile(
        process.env.APPWRITE_BUCKET_ID,
        fileId,
        InputFile.fromBuffer(fileBuffer, fileName)
      );

      const fileUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: fileUrl },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile picture updated successfully",
        user: {
          _id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture,
        },
      });
    } catch (uploadError) {
      console.log("Error uploading to Appwrite:", uploadError.message);
      return res.status(500).json({ message: "Failed to upload image" });
    }
  } catch (error) {
    console.log("Error in updateProfile controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleAuthCallback = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.redirect(
        `${
          process.env.CLIENT_URL || "http://localhost:5173"
        }/login?error=auth_failed`
      );
    }

    // Generate tokens for Google auth
    const accessToken = generateAccessToken(user._id);
    const refreshTokenValue = generateRefreshToken();

    await Session.create({
      userId: user._id,
      refreshToken: refreshTokenValue,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshTokenValue, getCookieOptions());

    // Redirect with access token in URL (frontend will extract it)
    res.redirect(
      `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/?token=${accessToken}`
    );
  } catch (error) {
    console.log("Error in googleAuth controller:", error.message);
    res.redirect(
      `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/login?error=server_error`
    );
  }
};

export const facebookAuth = async (req, res) => {
  try {
    const { email, fullName, profilePicture } = req.body;
  } catch (error) {
    console.log("Error in facebookAuth controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const users = await User.find({
      _id: { $ne: userId },
      fullName: { $regex: query, $options: "i" },
    }).select("_id fullName  profilePicture");

    res.status(200).json({ users });
  } catch (error) {
    console.log("Error in searchUsers controller:", error.message);
    res.status(500).json({ message: "Không tìm Thấy người dùng " });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
