import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">Know your fit before you apply.</h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-600">
        Roleprint compares your CV against any job description and gives you a match score,
        the skills you're missing, and what to fix.
      </p>
      <Link
        to="/match"
        className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark"
      >
        Check my match
      </Link>
    </section>
  );
}
