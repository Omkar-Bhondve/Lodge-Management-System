import "dotenv/config";

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be set in server/.env`);
  return value;
};

export const config = {
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "development-only-change-me",
  databaseUrl: process.env.DATABASE_URL,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "staywell",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
  },
  required,
};
