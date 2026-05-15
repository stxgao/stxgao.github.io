import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { pages } from '../constants/pages';

/**
 * Custom hook to synchronize the active tab index in the store
 * with the current browser URL path.
 */
export function useRouteSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedIndex, setSelectedIndex, selectTab } = useAppStore();

  useEffect(() => {
    const currentPage = pages.find((p) => p.route === location.pathname);
    if (currentPage && currentPage.index !== selectedIndex) {
      // Sync the store with the current route.
      // selectTab ensures the tab is added to visible tabs and history.
      selectTab(currentPage.index, navigate, 'route');
    } else if (location.pathname === '/' && selectedIndex !== -1) {
      setSelectedIndex(-1);
    }
  }, [location.pathname, selectedIndex, setSelectedIndex, selectTab, navigate]);
}
