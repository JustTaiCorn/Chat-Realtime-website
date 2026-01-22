import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.js";
import "./lib/passport.js";
import passport from "passport";
import { app, server } from "./socket/server.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import helmet from "helmet";
app.use(passport.initialize());
app.use(helmet());
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://chat-realtime-website.appwrite.network",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/ms", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("ms");
});
app.use("/api/v1", routes);
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
