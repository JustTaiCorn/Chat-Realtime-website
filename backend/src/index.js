import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.js";
import "./lib/passport.js";
import passport from "passport";
dotenv.config();
const app = express();
app.use(express.json());
import swaggerUi from "swagger-ui-express";
import fs from "fs";
app.use(passport.initialize());
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173'
];
app.use(cors({
    origin: function (origin, callback) {
        // cho phép request từ các origin có trong danh sách hoặc từ tool không có origin (Postman, cURL)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // nếu cần gửi cookie, auth header
}));
app.use(cookieParser());
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", routes);
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
