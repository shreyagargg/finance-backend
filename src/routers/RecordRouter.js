import express from 'express';
import { 
  CreateRecord, 
  GetAllRecords, 
  UpdateRecord, 
  DeleteRecord 
} from '../controllers/RecordController.js';
import {AuthMiddleware} from '../middlewares/AuthMiddleware.js'; 
import { role } from '../controllers/RoleController.js';

const RecordRouter = express.Router();

RecordRouter.use(AuthMiddleware);

// Viewing: Viewer, Analyst, Admin
RecordRouter.get('/', role('viewer', 'analyst', 'admin'), GetAllRecords);

// Management: Admin only
RecordRouter.post('/', role('admin'), CreateRecord);
RecordRouter.put('/:id', role('admin'), UpdateRecord);
RecordRouter.delete('/:id', role('admin'), DeleteRecord);

export { RecordRouter };