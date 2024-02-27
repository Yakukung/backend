import express from "express";
import { router as index } from "./api/index";
import { router as trip } from "./api/trip";
import { router as upload } from "./api/upload";
import cors from "cors";

// objectAPP => web api
export const app = express();

// รับการร้องขอเข้ามา ตรงๆให้ทำอะไร
app.use(
  cors({
    origin: "*",
  })
);

// ใช้ built-in middleware ของ Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// server start run go index
app.use("/", index);
app.use("/trip", trip);
app.use("/upload", upload);
