import express from 'express';
import {AuthRouter} from "./routers/AuthRouter.js"

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/auth', AuthRouter)

export default app;
