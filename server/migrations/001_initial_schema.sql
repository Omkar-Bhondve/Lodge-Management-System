CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone VARCHAR(30),
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  location VARCHAR(200) NOT NULL,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  type VARCHAR(80) NOT NULL,
  guests SMALLINT NOT NULL CHECK (guests > 0),
  beds SMALLINT NOT NULL CHECK (beds > 0),
  image TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]',
  tag VARCHAR(100),
  description TEXT,
  amenities JSONB NOT NULL DEFAULT '[]',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  room_id UUID NOT NULL REFERENCES rooms(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests SMALLINT NOT NULL CHECK (guests > 0),
  nightly_rate NUMERIC(12,2) NOT NULL,
  service_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(12) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (check_out > check_in)
);

CREATE INDEX IF NOT EXISTS bookings_room_dates_idx ON bookings (room_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings (user_id);
CREATE INDEX IF NOT EXISTS rooms_active_idx ON rooms (is_active, is_featured);
