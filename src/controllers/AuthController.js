import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

const Login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 🧱 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // 🧠 2. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    // 🔍 3. Fetch user
    const result = await pool.query(
      'SELECT id, email, password, role, is_active FROM users WHERE email = $1',
      [email]
    )

    const user = result.rows[0]

    // 🚫 4. Avoid user enumeration attack
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // 🚫 5. Check active status
    if (!user.is_active) {
      return res.status(403).json({ error: "User account is inactive" })
    }

    // 🔐 6. Compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // 🎟️ 7. Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    console.log("login called")

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error("Login Error:", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

// export { Login }

const Register = async (req, res) => {
  try {
    const { email, password, role } = req.body

    //  1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    //  2. Email format check (simple but effective)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    //  3. Password strength check
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    //  4. Prevent duplicate users
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" })
    }

    //  5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    //  6. Role control (prevent random roles)
    const allowedRoles = ['viewer', 'analyst', 'admin']
    const userRole = allowedRoles.includes(role) ? role : 'viewer'

    //  7. Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, role`,
      [email, hashedPassword, userRole]
    )

    console.log("register called")

    return res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0]
    })

  } catch (error) {
    console.error("Register Error:", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

// export { Register }

export {Login, Register}