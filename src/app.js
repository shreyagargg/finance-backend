import express from 'express';
import {AuthRouter} from "./routers/AuthRouter.js"
import { RecordRouter } from './routers/RecordRouter.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/auth', AuthRouter)
app.use('/records', RecordRouter)

export default app;
