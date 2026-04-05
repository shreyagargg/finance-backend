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

// export { CreateRecord, GetAllRecords };


const UpdateRecord = async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, description, date } = req.body;

  try {
    // Check if record exists first
   const checkRecord = await pool.query(
  "SELECT * FROM records WHERE id = $1 AND user_id = $2",
  [id, req.user.id]
);
    if (checkRecord.rows.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    const result = await pool.query(
      `UPDATE records 
       SET amount = COALESCE($1, amount), 
           type = COALESCE($2, type), 
           category = COALESCE($3, category), 
           description = COALESCE($4, description), 
           date = COALESCE($5, date) 
       WHERE id = $6 RETURNING *`,
      [amount, type, category, description, date, id]
    );

    res.json({ message: "Record updated successfully", record: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: "Update failed", detail: err.message });
  }
};

const DeleteRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM records WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error during deletion" });
  }
};

export { CreateRecord, GetAllRecords, UpdateRecord, DeleteRecord };