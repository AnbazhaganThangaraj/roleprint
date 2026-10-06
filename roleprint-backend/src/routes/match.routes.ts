import { Router } from 'express';
import { createMatch } from '../controllers/match.controller.js';

const router = Router();

router.post('/', createMatch);

export default router;
