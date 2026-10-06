import { useState } from 'react';
import { api } from '../lib/api.ts';
import CvUpload from '../components/CvUpload.tsx';

type MatchResult = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
};

export default function MatchPage() {
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post<MatchResult>('/match', { cvText, jdText });
      setResult(res.data);
    } catch {
      setError('Could not calculate the match. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">CV vs JD match</h1>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="cv-text" className="font-medium">Your CV</label>
          <CvUpload onParsed={(cv) => setCvText(cv.text)} />
          <textarea
            id="cv-text"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            rows={14}
            className="rounded-lg border border-slate-300 p-3"
            placeholder="Upload your CV above or paste its text here"
          />
        </div>
        <label className="flex flex-col gap-2">
          <span className="font-medium">Job description</span>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={14}
            className="rounded-lg border border-slate-300 p-3"
            placeholder="Paste the job description here"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !cvText || !jdText}
          className="rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark disabled:opacity-50 md:col-span-2"
        >
          {loading ? 'Checking…' : 'Get match score'}
        </button>
      </form>

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {result && (
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-4xl font-bold text-brand">{result.score}% match</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="font-semibold">Matched skills</h2>
              <p className="text-slate-600">{result.matchedSkills.join(', ') || 'None'}</p>
            </div>
            <div>
              <h2 className="font-semibold">Missing skills</h2>
              <p className="text-slate-600">{result.missingSkills.join(', ') || 'None'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
