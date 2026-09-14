import jwt from "jsonwebtoken";
import { config } from "./config.js";

export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

export const createToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, config.jwtSecret, {
    expiresIn: "7d",
  });

export const publicUser = (user) => ({
  id: user.id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.created_at,
});

export const roomPayload = (body) => ({
  name: body.name?.trim(),
  slug: body.slug?.trim().toLowerCase(),
  location: body.location?.trim(),
  price: Number(body.price),
  type: body.type?.trim(),
  guests: Number(body.guests),
  beds: Number(body.beds),
  image: body.image?.trim(),
  images: Array.isArray(body.images) ? body.images : [],
  tag: body.tag?.trim() || null,
  description: body.description?.trim() || null,
  amenities: Array.isArray(body.amenities) ? body.amenities : [],
  isFeatured: Boolean(body.isFeatured),
  isActive: body.isActive !== false,
});

export const validateRoom = (room) => {
  const required = ["name", "slug", "location", "type", "image"];
  if (required.some((key) => !room[key])) return "Name, slug, location, type, and image are required.";
  if (!Number.isFinite(room.price) || room.price < 0) return "Price must be a valid positive amount.";
  if (!Number.isInteger(room.guests) || room.guests < 1) return "Guests must be at least 1.";
  if (!Number.isInteger(room.beds) || room.beds < 1) return "Beds must be at least 1.";
  return null;
};
