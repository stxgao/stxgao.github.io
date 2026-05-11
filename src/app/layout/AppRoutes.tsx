import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import MarkdownPage from '../components/MarkdownPage';
import { pages } from '../constants/pages';

/**
 * Component that defines the application's routing structure.
 * Separates navigation logic from the main layout shell.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {pages.map(({ index, name, route }) => (
        <Route key={index} path={route} element={<MarkdownPage path={`/pages/${name}`} />} />
      ))}
      <Route path="/docs" element={<MarkdownPage path={`/pages/docs.md`} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
