import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import HomePage from './pages/HomePage.tsx';
import MatchPage from './pages/MatchPage.tsx';
import JobsPage from './pages/JobsPage.tsx';
import ApplicationsPage from './pages/ApplicationsPage.tsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
      </Route>
    </Routes>
  );
}
