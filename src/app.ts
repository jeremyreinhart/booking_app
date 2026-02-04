import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userAuth from "./routes/user";
import adminAuth from "./routes/admin";
import { errorHandler } from "./errors/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", userAuth);
app.use("/api", adminAuth);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
