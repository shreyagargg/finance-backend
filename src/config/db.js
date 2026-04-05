import 'dotenv/config'; 
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.db_url,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testDB() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ DB Connected:", res.rows[0]);
  } catch (err) {
    console.error("❌ DB Error:", err.message);
  }
}

export { pool, testDB };