import jwt from "jsonwebtoken"
import {pool} from "../config/db.js"

const AuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if(!token)
    return res.status(401).json({"error"})

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const result = await pool.query(
        "SELECT id, email, role, is_active FROM users WHERE id = $1",
        [decoded.id]
      );
  
      const user = result.rows[0];
  
      if (!user) return res.status(401).json({ error: "User not found" });
      if (!user.is_active) return res.status(403).json({ error: "User inactive" });
  
      req.user = user;
  
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

}