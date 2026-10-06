import { useRef, useState } from 'react';
import axios from 'axios';
import { api } from '../lib/api.ts';
import type { ParsedCv } from '../types/analysis.ts';

const MAX_BYTES = 5 * 1024 * 1024;

type Props = {
  onParsed: (cv: ParsedCv) => void;
};

export default function CvUpload({ onParsed }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading'>('idle');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function handleFile(file: File) {
    if (file.size > MAX_BYTES) {
      setIsError(true);
      setMessage('The file is larger than 5 MB.');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    setStatus('uploading');
    setIsError(false);
    setMessage(`Reading ${file.name}…`);
    try {
      const res = await api.post<ParsedCv>('/cv/parse', form);
      onParsed(res.data);
      setIsError(Boolean(res.data.warning));
      setMessage(res.data.warning ?? `Loaded ${res.data.fileName}. Check the text below before running the match.`);
    } catch (err) {
      setIsError(true);
      const apiError = axios.isAxiosError(err) ? (err.response?.data as { error?: string } | undefined)?.error : undefined;
      setMessage(apiError ?? 'Could not read the file. Is the backend running?');
    } finally {
      setStatus('idle');
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === 'uploading'}
        className="rounded-lg border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand hover:text-white disabled:opacity-50"
      >
        {status === 'uploading' ? 'Reading…' : 'Upload CV (PDF or DOCX)'}
      </button>
      {message && <p className={`text-sm ${isError ? 'text-amber-700' : 'text-slate-600'}`}>{message}</p>}
    </div>
  );
}
