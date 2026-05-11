import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import AppTree from './AppTree';
import Footer from './Footer';
import Sidebar from './Sidebar';
import AppTabs from './AppTabs';
import AppRoutes from './AppRoutes';
import { pages } from '../constants/pages';
import usePageTracking from '../hooks/usePageTracking';
import { useAppStore } from '../store/useAppStore';
import { usePanelResize } from '../hooks/usePanelResize';
import { useAppTheme } from '../hooks/useAppTheme';
import { useRouteSync } from '../hooks/useRouteSync';

/**
 * Main application routing shell and top-level layout wrapper.
 * Manages the global theme palette and controls conditional rendering
 * for the structural UI grid (Sidebar, Explorer Tree, Editor Tabs, and Markdown viewport).
 *
 * @returns {React.ReactElement} The rendered application layout.
 */
export default function App() {
  const { theme } = useAppTheme();
  const { handleMouseDown } = usePanelResize(theme);
  useRouteSync();
  usePageTracking();

  const { expanded, visiblePageIndexes, panelWidth, isMobile } = useAppStore();

  const visiblePages = useMemo(
    () =>
      visiblePageIndexes
        .map((index) => pages.find((x) => x.index === index))
        .filter((page): page is (typeof pages)[0] => page !== undefined),
    [visiblePageIndexes],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Box
        component="div"
        sx={{
          m: 0,
          p: 0,
          overflowY: 'hidden',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Sidebar */}
          <Box component="aside" sx={{ width: theme.layout.sidebarWidth, flexShrink: 0 }}>
            <Sidebar />
          </Box>

          {/* Side Panel (Explorer) */}
          <Box
            component="aside"
            sx={{
              backgroundColor: 'background.paper',
              width: isMobile ? `calc(100vw - ${theme.layout.sidebarWidth})` : panelWidth,
              minWidth: isMobile ? 'unset' : theme.layout.panelMinWidth,
              maxWidth: isMobile ? 'unset' : '50vw',
              position: 'relative',
              borderRight: isMobile ? 1 : 0,
              borderColor: 'divider',
              height: '100%',
              display: expanded ? 'flex' : 'none',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <AppTree />
            </Box>

            {/* Resizer Handle */}
            {!isMobile && (
              <Box
                onMouseDown={handleMouseDown}
                role="separator"
                aria-label="Side panel resizer"
                aria-valuenow={panelWidth}
                aria-valuemin={parseInt(theme.layout.panelMinWidth)}
                aria-valuemax={window.innerWidth / 2}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '1px',
                  height: '100%',
                  cursor: 'col-resize',
                  bgcolor: 'divider',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    width: '4px',
                  },
                  zIndex: 10,
                  transition: 'background-color 0.2s, width 0.2s',
                }}
              />
            )}
          </Box>

          {/* Main Content Area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minWidth: 0, // Ensure flexbox can shrink below content width
              display: isMobile && expanded ? 'none' : 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                height: theme.layout.tabHeight,
                flexShrink: 0,
              }}
            >
              <AppTabs pages={visiblePages} />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                scrollBehavior: 'smooth',
              }}
            >
              <AppRoutes />
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box component="footer" sx={{ height: theme.layout.footerHeight, flexShrink: 0 }}>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
