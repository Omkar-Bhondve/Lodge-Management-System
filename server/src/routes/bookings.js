import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils.js";

const router = Router();
const bookingSelect = `SELECT b.id, b.check_in AS "checkIn", b.check_out AS "checkOut", b.guests,
  b.nightly_rate AS "nightlyRate", b.service_fee AS "serviceFee", b.total_amount AS "totalAmount",
  b.status, b.created_at AS "createdAt", r.id AS "roomId", r.name AS "roomName", r.slug AS "roomSlug",
  r.location AS "roomLocation", r.image AS "roomImage", r.type AS "roomType"
  FROM bookings b JOIN rooms r ON r.id = b.room_id`;

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  const { roomId, checkIn, checkOut, guests } = req.body;
  if (!roomId || !checkIn || !checkOut || !Number.isInteger(Number(guests)) || Number(guests) < 1) {
    return res.status(400).json({ message: "Room, valid dates, and guest count are required." });
  }
  if (new Date(checkOut) <= new Date(checkIn)) return res.status(400).json({ message: "Check-out must be after check-in." });
  const roomResult = await query("SELECT id, price, guests FROM rooms WHERE id = $1 AND is_active = true", [roomId]);
  const room = roomResult.rows[0];
  if (!room) return res.status(404).json({ message: "Room not found." });
  if (Number(guests) > room.guests) return res.status(400).json({ message: `This room allows a maximum of ${room.guests} guests.` });
  const conflict = await query(
    `SELECT 1 FROM bookings WHERE room_id = $1 AND status IN ('pending', 'confirmed')
     AND daterange(check_in, check_out, '[)') && daterange($2::date, $3::date, '[)')`,
    [roomId, checkIn, checkOut],
  );
  if (conflict.rowCount) return res.status(409).json({ message: "This room is not available for those dates." });
  const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
  const serviceFee = 380;
  const total = Number(room.price) * nights + serviceFee;
  const { rows } = await query(
    `INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, nightly_rate, service_fee, total_amount)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [req.user.id, roomId, checkIn, checkOut, guests, room.price, serviceFee, total],
  );
  const booking = await query(`${bookingSelect} WHERE b.id = $1`, [rows[0].id]);
  res.status(201).json({ booking: booking.rows[0] });
}));

router.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(`${bookingSelect} WHERE b.user_id = $1 ORDER BY b.check_in DESC`, [req.user.id]);
  res.json({ bookings: rows });
}));

router.patch("/:id/cancel", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE id = $1 AND user_id = $2
     AND status IN ('pending', 'confirmed') RETURNING id`,
    [req.params.id, req.user.id],
  );
  if (!rows[0]) return res.status(404).json({ message: "Active booking not found." });
  res.json({ message: "Booking cancelled." });
}));

export default router;
