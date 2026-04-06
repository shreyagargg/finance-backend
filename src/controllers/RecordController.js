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
  try {
    const { category, type, startDate, endDate, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = "SELECT * FROM records WHERE deleted_at IS NULL";
    const values = [];

    if (category) {
      values.push(category);
      query += ` AND category = $${values.length}`;
    }
    if (type) {
      values.push(type);
      query += ` AND type = $${values.length}`;
    }
    if (search) {
      values.push(`%${search}%`);
      query += ` AND description ILIKE $${values.length}`;
    }

    // Add Pagination
    values.push(limit, offset);
    query += ` ORDER BY date DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query, values);
    
    res.json({
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        filters: { category, type, search }
      },
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch records" });
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

// Example check for the DeleteRecord
const DeleteRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE records SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id", 
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Record not found or already deleted" });
    }

    res.json({ message: "Record moved to trash (soft delete)" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

export { CreateRecord, GetAllRecords, UpdateRecord, DeleteRecord };