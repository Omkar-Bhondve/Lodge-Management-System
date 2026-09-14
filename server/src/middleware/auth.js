import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ message: "Authentication is required." });
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.status(401).json({ message: "Your session is invalid or expired." });
  }
}

export const requireAdmin = [
  requireAuth,
  (req, res, next) =>
    req.user.role === "admin"
      ? next()
      : res.status(403).json({ message: "Administrator access is required." }),
];
