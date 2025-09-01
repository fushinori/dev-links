import { Pool } from "pg";

export const sql = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
