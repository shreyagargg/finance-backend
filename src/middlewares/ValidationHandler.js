
const validateRecord = async (req, res, next) => {
  const { amount, type, category } = req.body;

  const validCategories = ['food', 'clothes', 'stationary', 'salary', 'bills', 'miscellaneous'];
  const validTypes = ['income', 'expense'];

  const errors = [];

  // 1. Amount Validation
  if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
    errors.push("Amount must be a positive number");
  }

  // 2. Type Validation
  if (!validTypes.includes(type)) {
    errors.push("Type must be either 'income' or 'expense'");
  }

  // 3. Category Validation
  if (!validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: "Validation Failed", 
      details: errors 
    });
  }

  next();
};

export { validateRecord };