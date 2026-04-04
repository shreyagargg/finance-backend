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

const Register = async (req, res) => {
  const {email, password, role} = req.body

const hashed = await bcrypt.hash(password, 10)

const result = await pool.query(
    `insert INTO users (email, password, role)
   VALUES ($1, $2, $3)
   RETURNING id, email, role`,
  [email, hashed, role || 'viewer']
);

  console.log("register called")

  res.status(201).json(result.rows[0])
}

export {Login, Register}