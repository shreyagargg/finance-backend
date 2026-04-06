import express from 'express';
import {AuthRouter} from "./routers/AuthRouter.js"
import { RecordRouter } from './routers/RecordRouter.js';
import { errorHandler } from './middlewares/ErrorHandler.js';
import { DashboardRouter } from './routers/DashboardRouter.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/records', RecordRouter)
app.use('/api/v1/dashboard', DashboardRouter)

app.use(errorHandler)

// ... existing routes ...

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log for the developer
  
  // Handle Postgres specific errors (like unique constraint violations)
  if (err.code === '23505') {
    return res.status(409).json({ error: "Conflict: Resource already exists" });
  }

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong"
  });
});

export default app;
