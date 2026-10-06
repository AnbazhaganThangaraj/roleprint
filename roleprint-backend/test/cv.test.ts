import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app.js';
import { cleanText, detectFileType, parseCv } from '../src/services/cv.service.js';
import { ParsedCvSchema } from '../src/schemas/analysis.schema.js';
import { makeDocx, makePdf } from './fixtures.js';

const cvLines = [
  'Priya Raman - Senior Frontend Engineer',
  'Experience: 6 years building React and TypeScript applications at a fintech company.',
  'Led a team of 4 engineers and migrated a legacy Angular app to React with Vite.',
  'Skills: React, TypeScript, Node.js, Tailwind, Jest, Cypress, AWS, Docker.',
  'Education: B.E. Computer Science, Anna University, 2018.',
];

describe('detectFileType', () => {
  it('recognises PDF, DOCX and rejects anything else', async () => {
    expect(detectFileType(makePdf(['hi']))).toBe('pdf');
    expect(detectFileType(await makeDocx(['hi']))).toBe('docx');
    expect(detectFileType(Buffer.from('plain text'))).toBeNull();
  });
});

describe('cleanText', () => {
  it('collapses spaces and blank lines and trims', () => {
    expect(cleanText('  a  b \r\n\r\n\r\n\r\n c  ')).toBe('a b\n\nc');
  });
});

describe('parseCv', () => {
  it('extracts text from a PDF', async () => {
    const result = await parseCv('cv.pdf', makePdf(cvLines));
    expect(ParsedCvSchema.parse(result)).toEqual(result);
    expect(result.fileType).toBe('pdf');
    expect(result.pageCount).toBe(1);
    expect(result.text).toContain('Senior Frontend Engineer');
    expect(result.text).toContain('Anna University');
    expect(result.warning).toBeNull();
  });

  it('extracts text from a DOCX', async () => {
    const result = await parseCv('cv.docx', await makeDocx(cvLines));
    expect(result.fileType).toBe('docx');
    expect(result.pageCount).toBeNull();
    expect(result.text.split('\n\n')).toEqual(cvLines);
    expect(result.warning).toBeNull();
  });

  it('warns when almost no text is found', async () => {
    const result = await parseCv('scan.pdf', makePdf(['Page 1']));
    expect(result.warning).toMatch(/scanned/);
  });

  it('rejects a corrupt PDF with a readable error', async () => {
    await expect(parseCv('bad.pdf', Buffer.from('%PDF-1.4 garbage'))).rejects.toMatchObject({ statusCode: 422 });
  });
});

describe('POST /api/cv/parse', () => {
  it('returns the parsed CV', async () => {
    const res = await request(app).post('/api/cv/parse').attach('file', makePdf(cvLines), 'cv.pdf');
    expect(res.status).toBe(200);
    expect(res.body.fileName).toBe('cv.pdf');
    expect(res.body.text).toContain('React');
  });

  it('rejects a missing file', async () => {
    const res = await request(app).post('/api/cv/parse');
    expect(res.status).toBe(400);
  });

  it('rejects unsupported file types', async () => {
    const res = await request(app).post('/api/cv/parse').attach('file', Buffer.from('hello'), 'cv.txt');
    expect(res.status).toBe(415);
  });

  it('rejects files over 5 MB', async () => {
    const big = Buffer.concat([makePdf(cvLines), Buffer.alloc(5 * 1024 * 1024)]);
    const res = await request(app).post('/api/cv/parse').attach('file', big, 'big.pdf');
    expect(res.status).toBe(413);
    expect(res.body.error).toMatch(/5 MB/);
  });
});
