import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Access token required"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
    return next(new Error("Unauthorized"));}
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch (error) {
  console.log("Error in socketAuthMiddleware:", error.message);}
}