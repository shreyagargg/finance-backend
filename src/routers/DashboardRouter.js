import express from 'express';
import { GetSummary } from '../controllers/DashboardController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import { role } from '../controllers/RoleController.js';

const DashboardRouter = express.Router();

DashboardRouter.use(AuthMiddleware);

// Viewers, Analysts, and Admins can all see the summary
DashboardRouter.get('/summary', role('viewer', 'analyst', 'admin'), GetSummary);

export { DashboardRouter };