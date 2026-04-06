import { pool } from "../config/db.js";

const GetSummary = async (req, res) => {
  try {
    // 1. Get Total Income, Total Expense, and Net Balance
    const totalsQuery = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
      FROM records
    `;

    // 2. Get Category-wise totals for expenses
    const categoryQuery = `
      SELECT category, SUM(amount) as total 
      FROM records 
      WHERE type = 'expense'
      GROUP BY category
      ORDER BY total DESC
    `;

    // 3. Get Recent Activity (Last 5 transactions)
    const recentQuery = `
      SELECT * FROM records 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    const [totals, categories, recent] = await Promise.all([
      pool.query(totalsQuery),
      pool.query(categoryQuery),
      pool.query(recentQuery)
    ]);

    const income = parseFloat(totals.rows[0].total_income || 0);
    const expenses = parseFloat(totals.rows[0].total_expenses || 0);

    res.json({
      summary: {
        total_income: income,
        total_expenses: expenses,
        net_balance: income - expenses
      },
      category_distribution: categories.rows,
      recent_activity: recent.rows
    });

  } catch (err) {
    res.status(500).json({ error: "Summary generation failed", detail: err.message });
  }
};

export { GetSummary };