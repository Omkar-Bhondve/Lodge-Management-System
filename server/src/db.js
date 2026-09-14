import pg from "pg";
import { config } from "./config.js";

const { Pool } = pg;
export const pool = new Pool(
  config.databaseUrl
    ? { connectionString: config.databaseUrl }
    : config.db,
);

export const query = (text, params) => pool.query(text, params);
