import express from "express";
import { conn, queryAsync } from "../dbconnect";
import { users } from "../model/user";
import bodyParser from 'body-parser';
export const router = express.Router();

//แสดงข้อมูล User ทั้งหมด
router.post("/", (req, res) => {
    conn.query('select * from users', (err, result, fields)=>{
      res.json(result);
    });
  });

// ล็อคอิน
router.post("/signin", (req, res) => {
  let user_email = req.body.email;
  let user_password = req.body.password;
  conn.query('SELECT * FROM users WHERE email = ? AND password = ?', [user_email, user_password], (err, result, fields) => {
      if (err) {
          console.error("Error during sign-in:", err);
          res.status(500).json({ error: "Internal Server Error" });
      } else {
          res.json(result);
      }
  });
});