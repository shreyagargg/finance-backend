// Got it—thanks for clarifying. Since this is a **fresh assignment (no Firebase)**

// 👉 That’s enough to satisfy:

// * User management ✅
// * Access control ✅
// * Real-world backend behavior ✅

// ---

// # ⚡ Minimal Auth You Should Build (DON’T OVERDO)

// ## 1. Register

// ```http
// POST /auth/register
// ```

// * email
// * password
// * role (optional, default = viewer)

// ---

// ## 2. Login

// ```http
// POST /auth/login
// ```

// * email + password
// * return JWT token

// ---

// ## 3. Auth Middleware

// * Verify token
// * Attach user to `req.user`

// ---

// # 🔥 Modify Your Current Approach (Clean Version)

// You don’t need `/sync` anymore.

// Instead:

// ---

// ## ✅ Users Table (final)

// ```sql
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   email TEXT UNIQUE NOT NULL,
//   password TEXT NOT NULL,

//   role TEXT CHECK (role IN ('viewer', 'analyst', 'admin')) DEFAULT 'viewer',
//   is_active BOOLEAN DEFAULT TRUE,

//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// ```

// ---

// ## ✅ Auth Middleware (replace Firebase one)

// ```js
// import jwt from "jsonwebtoken";
// import { pool } from "../db.js";

// export const authMiddleware = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "Unauthorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const result = await pool.query(
//       "SELECT id, email, role, is_active FROM users WHERE id = $1",
//       [decoded.id]
//     );

//     const user = result.rows[0];

//     if (!user) return res.status(401).json({ error: "User not found" });
//     if (!user.is_active) return res.status(403).json({ error: "User inactive" });

//     req.user = user;

//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// };
// ```

// ---

// ## ✅ Login Route

// ```js
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const result = await pool.query(
//     "SELECT * FROM users WHERE email = $1",
//     [email]
//   );

//   const user = result.rows[0];
//   if (!user) return res.status(401).json({ error: "Invalid credentials" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

//   const token = jwt.sign(
//     { id: user.id },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   res.json({ token });
// });
// ```

// ---

// ## ✅ Register Route

// ```js
// router.post("/register", async (req, res) => {
//   const { email, password, role } = req.body;

//   const hashed = await bcrypt.hash(password, 10);

//   const result = await pool.query(
//     `INSERT INTO users (email, password, role)
//      VALUES ($1, $2, $3)
//      RETURNING id, email, role`,
//     [email, hashed, role || "viewer"]
//   );

//   res.status(201).json(result.rows[0]);
// });
// ```

// ---

// # 🔐 Add RBAC (MANDATORY for assignment)

// ```js
// export const requireRole = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ error: "Forbidden" });
//     }
//     next();
//   };
// };
// ```

// ---

// # 🧩 How You’ll Use It

// ```js
// router.post("/records", authMiddleware, requireRole("admin"), ...)
// ```

// ---

// # 🚫 What NOT to Do (Important)

// * ❌ Don’t add OAuth / Firebase now
// * ❌ Don’t overcomplicate sessions
// * ❌ Don’t build refresh tokens

// ---

// # 🏁 Final Approach (Best for 2 Days)

// | Feature           | Do?    |
// | ----------------- | ------ |
// | JWT Auth          | ✅ YES  |
// | RBAC              | ✅ MUST |
// | Firebase/Auth0    | ❌ NO   |
// | Advanced security | ❌ NO   |

// ---

// # 💬 Bottom Line

// 👉 Yes, you **should add auth**, but:

// * Keep it **simple**
// * Focus on **JWT + roles**
// * Integrate it with your current structure

// ---

// If you want next step, I can:

// * Plug this directly into your **existing folder structure**
// * Or help you build **records + dashboard APIs fast** (next big part)
