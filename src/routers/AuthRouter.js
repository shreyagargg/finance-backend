import express from 'express';
import { Login, Register } from '../controllers/AuthController.js';

const AuthRouter = express.Router();

AuthRouter.post('/register', Register);
AuthRouter.post('/login', Login);

export { AuthRouter };
