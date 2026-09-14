import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler, publicUser } from "../utils.js";

const router = Router();
router.use(requireAdmin);

router.get("/dashboard", asyncHandler(async (_req, res) => {
  const { rows } = await query(`SELECT
    (SELECT COUNT(*) FROM rooms WHERE is_active) AS "roomCount",
    (SELECT COUNT(*) FROM users WHERE role = 'user') AS "userCount",
    (SELECT COUNT(*) FROM bookings WHERE status IN ('pending','confirmed')) AS "activeBookingCount",
    (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE status = 'confirmed') AS revenue`);
  res.json({ dashboard: rows[0] });
}));

router.get("/users", asyncHandler(async (_req, res) => {
  const { rows } = await query("SELECT * FROM users ORDER BY created_at DESC");
  res.json({ users: rows.map(publicUser) });
}));

router.get("/bookings", asyncHandler(async (_req, res) => {
  const { rows } = await query(`SELECT b.*, u.first_name, u.last_name, u.email, u.phone,
    r.name AS room_name, r.slug AS room_slug, r.image AS room_image, r.location AS room_location, r.type AS room_type
    FROM bookings b JOIN users u ON u.id = b.user_id JOIN rooms r ON r.id = b.room_id ORDER BY b.created_at DESC`);
  res.json({ bookings: rows });
}));

router.patch("/bookings/:id/status", asyncHandler(async (req, res) => {
  const allowed = ["pending", "confirmed", "cancelled", "completed"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid booking status." });
  const { rows } = await query("UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *", [req.body.status, req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: "Booking not found." });
  res.json({ booking: rows[0] });
}));

export default router;
