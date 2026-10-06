// Turns an uploaded CV file (PDF or DOCX) into plain text the user can review before analysis.
import mammoth from 'mammoth';
import { extractText } from 'unpdf';
import type { ParsedCv } from '../schemas/analysis.schema.js';
import { AppError } from '../utils/errors.js';

export const MAX_CV_BYTES = 5 * 1024 * 1024;

// Below this many characters the file probably holds images of text (a scan) rather than text.
const MIN_TEXT_CHARS = 200;

type CvFileType = ParsedCv['fileType'];

// Detect the type from the file's first bytes, not its name or the browser's MIME type.
export function detectFileType(buffer: Buffer): CvFileType | null {
  if (buffer.subarray(0, 5).toString('latin1') === '%PDF-') return 'pdf';
  // DOCX is a ZIP archive, which starts with "PK\x03\x04"
  if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) {
    return 'docx';
  }
  return null;
}

export function cleanText(raw: string): string {
  return raw
    .replace(/\r\n?/g, '\n')
    .replace(/ /g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function extractPdf(buffer: Buffer) {
  const { totalPages, text } = await extractText(new Uint8Array(buffer));
  return { text: text.join('\n\n'), pageCount: totalPages };
}

async function extractDocx(buffer: Buffer) {
  const { value } = await mammoth.extractRawText({ buffer });
  return { text: value, pageCount: null };
}

export async function parseCv(fileName: string, buffer: Buffer): Promise<ParsedCv> {
  const fileType = detectFileType(buffer);
  if (!fileType) {
    throw new AppError(415, 'Only PDF and DOCX files are supported');
  }

  let extracted: { text: string; pageCount: number | null };
  try {
    extracted = fileType === 'pdf' ? await extractPdf(buffer) : await extractDocx(buffer);
  } catch {
    throw new AppError(422, `Could not read this ${fileType.toUpperCase()} file. Try another copy or paste the text instead.`);
  }

  const text = cleanText(extracted.text);
  const warning =
    text.length < MIN_TEXT_CHARS
      ? 'Very little text was found. If this is a scanned CV, paste the text instead.'
      : null;

  return {
    fileName,
    fileType,
    text,
    charCount: text.length,
    pageCount: extracted.pageCount,
    warning,
  };
}
