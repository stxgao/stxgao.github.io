import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { pages } from '../constants/pages';

/**
 * Custom hook to synchronize the active tab index in the store
 * with the current browser URL path.
 */
export function useRouteSync() {
  const location = useLocation();
  const { selectedIndex, setSelectedIndex } = useAppStore();

  useEffect(() => {
    const currentPage = pages.find((p) => p.route === location.pathname);
    if (currentPage && currentPage.index !== selectedIndex) {
      setSelectedIndex(currentPage.index);
    } else if (location.pathname === '/' && selectedIndex !== -1) {
      setSelectedIndex(-1);
    }
  }, [location.pathname, selectedIndex, setSelectedIndex]);
}
