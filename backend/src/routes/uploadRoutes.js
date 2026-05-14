import express from 'express';
import multer from 'multer';
import { upload } from '../controllers/uploadController.js';

const router = express.Router();

const uploadMiddleware = multer({ dest: 'uploads/' });

router.post('/', uploadMiddleware.single('file'), upload);

export default router;