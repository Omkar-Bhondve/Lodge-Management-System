import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../db.js";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../migrations");
const files = (await fs.readdir(folder)).filter((file) => file.endsWith(".sql")).sort();
try {
  for (const file of files) {
    console.log(`Applying ${file}`);
    await pool.query(await fs.readFile(path.join(folder, file), "utf8"));
  }
  console.log("Migrations complete.");
} finally { await pool.end(); }
