import express from 'express';
import { 
  CreateRecord, 
  GetAllRecords, 
  UpdateRecord, 
  DeleteRecord 
} from '../controllers/RecordController.js';
import {AuthMiddleware} from '../middlewares/AuthMiddleware.js'; 
import { role } from '../controllers/RoleController.js';
import { validateRecord } from '../middleware/Validate.js';
// ... other imports

// Apply validation specifically to routes that modify data

const RecordRouter = express.Router();

RecordRouter.use(AuthMiddleware);

// Viewing: Viewer, Analyst, Admin
RecordRouter.get('/', role('viewer', 'analyst', 'admin'), GetAllRecords);

// Management: Admin only
RecordRouter.post('/', role('admin'), CreateRecord);
RecordRouter.put('/:id', role('admin'), UpdateRecord);
RecordRouter.delete('/:id', role('admin'), DeleteRecord);

RecordRouter.put('/:id', role('admin'), validateRecord, UpdateRecord);
RecordRouter.post('/', role('admin'), validateRecord, CreateRecord);


export { RecordRouter };