import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/match', label: 'Match' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/applications', label: 'Applications' },
];

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
          <NavLink to="/" className="text-lg font-bold text-brand">
            Roleprint
          </NavLink>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'font-medium text-brand' : 'text-slate-600 hover:text-slate-900'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
