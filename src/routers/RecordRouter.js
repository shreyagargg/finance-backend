import express from 'express';
import { CreateRecord, GetAllRecords } from '../controllers/RecordController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js'; // Assuming that's the name
import { role } from '../controllers/AuthController.js';

const RecordRouter = express.Router();

// All record routes require being logged in
RecordRouter.use(AuthMiddleware);

// Viewer, Analyst, and Admin can all VIEW records
RecordRouter.get('/', role('viewer', 'analyst', 'admin'), GetAllRecords);

// Only Admin can CREATE records (as per your assessment prompt)
RecordRouter.post('/', role('admin'), CreateRecord);

export { RecordRouter };