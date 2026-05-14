import express from 'express';
import { getDriveFile } from '../controllers/fileController.js';

const router = express.Router();

router.get('/:fileId', getDriveFile);

export default router;