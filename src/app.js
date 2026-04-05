import express from 'express';
import {AuthRouter} from "./routers/AuthRouter.js"
import { RecordRouter } from './routers/RecordRouter.js';
import { errorHandler } from './middlewares/ErrorHandler.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/records', RecordRouter)


app.use(errorHandler)

export default app;
