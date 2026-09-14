import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler, roomPayload, validateRoom } from "../utils.js";

const router = Router();
const selectRooms = `SELECT id, name, slug, location, price, type, guests, beds, image, images, tag,
  description, amenities, is_featured AS "isFeatured", is_active AS "isActive", rating, review_count AS reviews,
  created_at AS "createdAt", updated_at AS "updatedAt" FROM rooms`;

router.get("/", asyncHandler(async (req, res) => {
  const { search = "", type, featured } = req.query;
  const params = [];
  const filters = ["is_active = true"];
  if (search) { params.push(`%${search}%`); filters.push(`(name ILIKE $${params.length} OR location ILIKE $${params.length})`); }
  if (type) { params.push(type); filters.push(`type = $${params.length}`); }
  if (featured === "true") filters.push("is_featured = true");
  const { rows } = await query(`${selectRooms} WHERE ${filters.join(" AND ")} ORDER BY is_featured DESC, created_at DESC`, params);
  res.json({ rooms: rows });
}));

router.get("/:slug", asyncHandler(async (req, res) => {
  const { rows } = await query(`${selectRooms} WHERE slug = $1 AND is_active = true`, [req.params.slug]);
  if (!rows[0]) return res.status(404).json({ message: "Room not found." });
  res.json({ room: rows[0] });
}));

router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const room = roomPayload(req.body);
  const problem = validateRoom(room);
  if (problem) return res.status(400).json({ message: problem });
  const { rows } = await query(
    `INSERT INTO rooms (name, slug, location, price, type, guests, beds, image, images, tag, description, amenities, is_featured, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [room.name, room.slug, room.location, room.price, room.type, room.guests, room.beds, room.image, JSON.stringify(room.images), room.tag, room.description, JSON.stringify(room.amenities), room.isFeatured, room.isActive],
  );
  res.status(201).json({ room: rows[0] });
}));

router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const room = roomPayload(req.body);
  const problem = validateRoom(room);
  if (problem) return res.status(400).json({ message: problem });
  const { rows } = await query(
    `UPDATE rooms SET name=$1, slug=$2, location=$3, price=$4, type=$5, guests=$6, beds=$7, image=$8,
     images=$9, tag=$10, description=$11, amenities=$12, is_featured=$13, is_active=$14, updated_at=NOW()
     WHERE id=$15 RETURNING *`,
    [room.name, room.slug, room.location, room.price, room.type, room.guests, room.beds, room.image, JSON.stringify(room.images), room.tag, room.description, JSON.stringify(room.amenities), room.isFeatured, room.isActive, req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ message: "Room not found." });
  res.json({ room: rows[0] });
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const { rowCount } = await query("UPDATE rooms SET is_active = false, updated_at = NOW() WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ message: "Room not found." });
  res.status(204).end();
}));

export default router;
