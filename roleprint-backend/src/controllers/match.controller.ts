import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { scoreMatch } from '../services/match.service.js';

export function createMatch(req: Request, res: Response, next: NextFunction) {
  try {
    const { cvText, jdText } = req.body ?? {};
    if (typeof cvText !== 'string' || !cvText.trim()) {
      throw new AppError(400, 'cvText is required');
    }
    if (typeof jdText !== 'string' || !jdText.trim()) {
      throw new AppError(400, 'jdText is required');
    }
    res.json(scoreMatch(cvText, jdText));
  } catch (err) {
    next(err);
  }
}
