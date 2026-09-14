import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, createToken, publicUser } from "../utils.js";

const router = Router();

router.post("/register", asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone = null } = req.body;
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password || password.length < 8) {
    return res.status(400).json({ message: "First name, last name, email, and a password of at least 8 characters are required." });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const { rows } = await query(
      `INSERT INTO users (first_name, last_name, email, password_hash, phone)
       VALUES ($1, $2, LOWER($3), $4, $5) RETURNING *`,
      [firstName.trim(), lastName.trim(), email.trim(), passwordHash, phone?.trim() || null],
    );
    const user = rows[0];
    res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ message: "An account with this email already exists." });
    throw error;
  }
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await query("SELECT * FROM users WHERE email = LOWER($1)", [email?.trim()]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password || "", user.password_hash))) {
    return res.status(401).json({ message: "Email or password is incorrect." });
  }
  res.json({ token: createToken(user), user: publicUser(user) });
}));

router.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM users WHERE id = $1", [req.user.id]);
  if (!rows[0]) return res.status(404).json({ message: "User not found." });
  res.json({ user: publicUser(rows[0]) });
}));

export default router;
