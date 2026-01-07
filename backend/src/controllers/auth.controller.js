import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import { storage, ID } from "../lib/appwrite.js";
import { InputFile } from "node-appwrite/file";

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
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        success: true,
        message: "User created successfully",
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
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error", error});
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message });
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
      console.log(file);

      // Tạo File object từ buffer
      const fileBuffer = file.buffer;
      const fileName = file.originalname;


      const uploadedFile = await storage.createFile(
        process.env.APPWRITE_BUCKET_ID,
        fileId,
        InputFile.fromBuffer(fileBuffer, fileName)
      );
      console.log(uploadedFile);
      // Tạo URL để truy cập file
      const fileUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

      // Chỉ cập nhật ảnh profile trong MongoDB
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
      console.log(uploadError);
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
    const user = await User.findById(req.user.id).select("-password");

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
      // Redirect về frontend với error
      return res.redirect(
        `${
          process.env.CLIENT_URL || "http://localhost:5173"
        }/login?error=auth_failed`
      );
    }

    generateToken(user._id, res);

    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/`);
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
