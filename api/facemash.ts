import express from "express";
import { conn, queryAsync } from "../dbconnect";
import { users } from "../model/user";
import bodyParser from 'body-parser';

export const router = express.Router();

//แสดงข้อมูล  โหวต  2 คน
router.post("/vote", (req, res) => {
  conn.query('SELECT * FROM posts INNER JOIN users ON posts.user_id = users.user_id;', (err, result, fields) => {
    if (err) {
      res.json(err);
    } else {
      const randomIndexes: number[] = [];
  
      while (randomIndexes.length < 2) {
        const randomIndex = Math.floor(Math.random() * result.length);
  
        const previousIndex = randomIndexes[randomIndexes.length - 1];
        const selectedUserId = result[randomIndex].user_id;
        const previousUserId = previousIndex !== undefined ? result[previousIndex].user_id : undefined;
  
        if (previousUserId !== selectedUserId) {
          randomIndexes.push(randomIndex);
        }
      }
  
      const randomImages = randomIndexes.map((index) => result[index]);
  
      res.json(randomImages);
    }
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

router.post('/signup', (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  conn.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
    [first_name, last_name, email, password],
    (err, result) => {
      if (err) {
        console.error('Error during user signup:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('User successfully signed up:', result);
        res.json({ message: 'User signed up successfully' });
      }
    }
  );
});

router.post("/homepage", (req, res) => {
  const user_id = req.body.user_id;
  conn.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, result, fields) => {
    if (err) {
      console.error("Error fetching user data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.length > 0) {
        const user_data = result[0];
        res.json(user_data);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    }
  });
});

router.post("/navbar", (req, res) => {
  const user_id = req.body.user_id;
  conn.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, result, fields) => {
    if (err) {
      console.error("Error fetching user data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.length > 0) {
        const user_data = result[0];
        res.json(user_data);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    }
  });
});

router.post("/profile", (req, res) => {
  const user_id = req.body.user_id;
  conn.query('SELECT users.*, posts.* FROM users LEFT JOIN posts ON users.user_id = posts.user_id WHERE users.user_id = ?', [user_id], (err, result, fields) => {
    if (err) {
      console.error("Error fetching user data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.length > 0) {
        const user_data = result[0];
        res.json(user_data);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    }
  });
});

