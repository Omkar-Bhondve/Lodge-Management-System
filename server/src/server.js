import app from "./app.js";
import { pool } from "./db.js";
import { config } from "./config.js";

pool.query("SELECT 1")
  .then(() => app.listen(config.port, () => console.log(`API listening at http://localhost:${config.port}`)))
  .catch((error) => { console.error("PostgreSQL connection failed:", error.message); process.exit(1); });
