import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { parseCv } from '../services/cv.service.js';

export async function parseCvUpload(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError(400, 'Attach a CV file in the "file" field');
    }
    res.json(await parseCv(req.file.originalname, req.file.buffer));
  } catch (err) {
    next(err);
  }
}
