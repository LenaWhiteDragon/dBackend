import * as pg from "pg";

const { Pool } = pg;

let localPoolConfig = {
  user: "postgres",
  password: "1",
  host: "localhost",
  port: 5432, //5054
  database: "wh",
};

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : localPoolConfig;

const pool = new Pool(poolConfig);

export default pool;
