import bcrypt from 'bcrypt.js'
import jwt from 'jsonwebtoken'

const Login = async (req, res) => {
  const {email, password} = req.body

  const result = await pool.query(
    'select * from users where email = $1',
    [email]
  )

  const user = result.rows[0]
  if(!user)
      return res.status(404).json("no user")

  const is_match = await bcrypt.compare(password, user.password)
  if(!is_match)
    return res.status(401).json("wrong password")

  const token = jwt.sign(
    {id: user.id, role: user.role},
    process.env.JWT_SECRET,
    {expiresIn: '1d'}
  )

  res.json({token})

  console.log("login called")

}

import bcrypt from 'bcryptjs'
import { pool } from '../config/db.js'

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