import {
  Container,
  createTheme,
  CssBaseline,
  darkScrollbar,
  Grid,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import AppTree from "./AppTree";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import AppButtons from "./AppButtons";
import MDContainer from "../components/MDContainer";
import Home from "../pages/Home";
import { pages } from "../pages/pages";
import usePageTracking from "../hooks/usePageTracking";
import { useAppStore } from "../store/useAppStore";

/**
 * Main application routing shell and top-level layout wrapper.
 * Manages the global theme palette and controls conditional rendering
 * for the structural UI grid (Sidebar, Explorer Tree, Editor Tabs, and Markdown viewport).
 * 
 * @returns {React.ReactElement} The rendered application layout.
 */
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  usePageTracking();

  const {
    expanded,
    selectedIndex,
    setSelectedIndex,
    visiblePageIndexes,
    darkMode,
  } = useAppStore();

  const visiblePages = useMemo(
    () => visiblePageIndexes
      .map((index) => pages.find((x) => x.index === index))
      .filter((page): page is (typeof pages)[0] => page !== undefined),
    [visiblePageIndexes]
  );

  useEffect(() => {
    const currentPage = pages.find((p) => p.route === location.pathname);
    if (currentPage && currentPage.index !== selectedIndex) {
      setSelectedIndex(currentPage.index);
    } else if (location.pathname === "/" && selectedIndex !== -1) {
      setSelectedIndex(-1);
    }
  }, [location.pathname, selectedIndex, setSelectedIndex]);

  const paletteType = darkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#FFFFFF" : "#1e1e1e",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: paletteType === "dark" ? darkScrollbar() : null,
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: "rgba(255, 255, 255, 0.12)",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Container
        sx={{ m: 0, p: 0, overflowY: "hidden" }}
        maxWidth={false}
        disableGutters
      >
        <Grid container sx={{ overflow: "auto", overflowY: "hidden" }}>
          <Grid container sx={{ overflow: "auto" }}>
            <Grid item sx={{ width: 50 }}>
              <Sidebar />
            </Grid>
            {expanded && (
              <Grid
                item
                sx={{
                  backgroundColor: darkMode ? "#252527" : "#f3f3f3",
                  width: 220,
                }}
              >
                <Stack sx={{ mt: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 4 }}
                  >
                    EXPLORER
                  </Typography>
                  <AppTree />
                </Stack>
              </Grid>
            )}

            <Grid item xs zeroMinWidth>
              <Grid
                sx={{
                  height: "33px",
                }}
              >
                <AppButtons pages={visiblePages} />
              </Grid>

              <Grid
                sx={{
                  scrollBehavior: "smooth",
                  overflowY: "auto",
                  height: `calc(100vh - 20px - 33px)`,
                }}
              >
                <Routes>
                  <Route
                    path="/"
                    element={<Home />}
                  />
                  {pages.map(({ index, name, route }) => (
                    <Route
                      key={index}
                      path={route}
                      element={<MDContainer path={`/pages/${name}`} />}
                    />
                  ))}
                  <Route
                    path="/docs"
                    element={<MDContainer path={`/pages/docs.md`} />}
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Footer />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
