import { pool } from "../config/db.js";

const CreateRecord = async (req, res) => {
  const { amount, type, category, description, date } = req.body;

  // validating inputs
  if (!amount || !type || !category) {
  return res.status(400).json({ error: "Missing required fields" });
}

if (!['income', 'expense'].includes(type)) {
  return res.status(400).json({ error: "Invalid type" });
}

if (typeof amount !== 'number' || amount <= 0) {
  return res.status(400).json({ error: "Amount must be a positive number" });
}

  try {
    const result = await pool.query(
      `INSERT INTO records (user_id, amount, type, category, description, date) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, amount, type, category, description, date || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Invalid data or category", detail: err.message });
  }
};

const GetAllRecords = async (req, res) => {
  const { category, type, startDate, endDate } = req.query;
  
  // Basic dynamic filtering logic
  let query = "SELECT * FROM records WHERE user_id = $1";
let params = [req.user.id];

  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }
  if (type) {
    params.push(type);
    query += ` AND type = $${params.length}`;
  }

  query += " ORDER BY date DESC";

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching records" });
  }
};

export { CreateRecord, GetAllRecords };