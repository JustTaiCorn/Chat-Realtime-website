import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const URI = process.env.MONGO_URI;

mongoose
  .connect(URI)
  .then(async () => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("123456", salt);
    await mongoose.connection.collection("users").updateOne(
      { email: "test@gmail.com" },
      {
        $set: {
          fullName: "Test User",
          email: "test@gmail.com",
          password: password,
          profilePicture: "",
        },
      },
      { upsert: true },
    );
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
