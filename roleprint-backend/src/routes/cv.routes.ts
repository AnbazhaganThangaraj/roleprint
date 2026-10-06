import { Router } from 'express';
import multer from 'multer';
import { parseCvUpload } from '../controllers/cv.controller.js';
import { MAX_CV_BYTES } from '../services/cv.service.js';

const router = Router();

// Files stay in memory only; nothing is written to disk.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_CV_BYTES, files: 1 } });

router.post('/parse', upload.single('file'), parseCvUpload);

export default router;
