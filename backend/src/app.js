import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import connectionInstance from "./config/db.js";
import "./config/passport.auth.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(passport.initialize());

import adminRouter  from "./routes/admin.route.js"
import userRouter from "./routes/auth.route.js";
import taskRouter from "./routes/task.route.js";

app.use("/admin",   adminRouter )
app.use("/user", userRouter);
app.use("/task", taskRouter);



const serverConnection = async () => {
  try {
    await connectionInstance();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection error:", error.message);
    process.exit(1);
  }
};

serverConnection();
