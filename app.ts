//app.ts
import express from "express";
import { router as index } from "./api/index";
import { router as trip } from "./api/trip";
// import { router as upload } from "./api/upload";
import cors from "cors";
import path from "path";

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

// เพิ่มบรรทัดนี้เพื่อให้ Express เข้าถึงไฟล์ index.html ในที่อยู่ที่ระบุ
// app.use(express.static("/Users/yakukung/node-express-mysql/"));

// server start run go index
app.use("/trip", trip);
// app.use("/upload", upload);

// app.get('/', (req, res) => {
//   res.sendFile("index.html", { root: "/Users/yakukung/node-express-mysql/" });
// });
