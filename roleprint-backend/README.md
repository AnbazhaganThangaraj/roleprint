# roleprint-backend

Express API for Roleprint. See the main [README](../README.md) for setup.

## Endpoints

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/match` | `{ cvText, jdText }` | `{ score, matchedSkills, missingSkills }` |
| POST | `/api/cv/parse` | multipart form, `file` = PDF or DOCX up to 5 MB | `{ fileName, fileType, text, charCount, pageCount, warning }` |

The analysis contract (`MatchAnalysis`) lives in `src/schemas/analysis.schema.ts`.

## Tests

```bash
npm test
```
