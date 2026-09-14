import bcrypt from "bcryptjs";
import { config } from "../config.js";
import { pool, query } from "../db.js";

try {
  const email = config.required("ADMIN_EMAIL").toLowerCase();
  const password = config.required("ADMIN_PASSWORD");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
  const passwordHash = await bcrypt.hash(password, 12);
  await query(`INSERT INTO users (first_name, last_name, email, password_hash, role)
    VALUES ('System', 'Admin', $1, $2, 'admin')
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'`, [email, passwordHash]);
  console.log(`Admin account ready for ${email}`);
} finally { await pool.end(); }
