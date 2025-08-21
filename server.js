import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import buildRouter from "./api/build.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static client
app.use("/", express.static(path.join(__dirname, "public")));

// API
app.use("/api/build", buildRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`TOBI AI App Builder running on http://localhost:${PORT}`);
});
