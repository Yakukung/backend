//upload.ts
import express from "express";
import path from "path";
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "@firebase/storage";
import fs from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyDS6QsLlBnbp9W_8b-DgF-AUddJNqUd8fo",
  authDomain: "node-express-mysql-982a1.firebaseapp.com",
  projectId: "node-express-mysql-982a1",
  storageBucket: "node-express-mysql-982a1.appspot.com",
  messagingSenderId: "290288082757",
  appId: "1:290288082757:web:6078d0a5acfa72a6d2282c",
  measurementId: "G-V3BJ87LWF9"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export const router = express.Router();

class FileMiddleware {
  filename = "";
  public readonly diskLoader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 67108864, // 64 MByte
    },
  });
}

const fileUpload = new FileMiddleware();

router.post("/", fileUpload.diskLoader.single("file"), async (req, res) => {
  try {
    // Check if req.file is defined
    if (!req.file) {
      res.status(400).json({ error: "File not found in request" });
      return;
    }

    const fileBuffer = req.file.buffer;

    const originalFileName = req.file.originalname;
    const localFilePath = path.join(__dirname, "../uploads", originalFileName); 

    // Save to local directory
    await fs.promises.writeFile(localFilePath, fileBuffer);

    // Save to Firebase Storage
    const filePath = "/uploads/" + originalFileName;  
    const storageRef = ref(storage, filePath);

    await uploadBytes(storageRef, fileBuffer);

    res.json({ filename: filePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get /upload
router.get("/", (req, res) => {
  res.send('Method GET in upload.ts');
});
