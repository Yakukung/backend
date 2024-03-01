//app.ts
import express from "express";
import cors from "cors";
import path from "path";

import { router as facemash } from "./api/facemash";

export const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/facemash", facemash);
