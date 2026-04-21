import {
  Box,
  Grid,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import logo from "../../static/favicon.png";
import { useLocation } from "react-router-dom";
import { links } from "./links";
import { useAppStore } from "../store/useAppStore";

export default function Home() {
  const { pathname } = useLocation();
  const { setSelectedIndex } = useAppStore();
  
  useEffect(() => {
    setSelectedIndex(-1);
  }, [setSelectedIndex]);

  useEffect(() => {
    document.title = import.meta.env.VITE_APP_NAME;
  }, [pathname]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: `calc(100vh - 20px - 33px)` }}
    >
      <Grid item xs={3}>
        <Stack direction={{ xs: "column", sm: "row-reverse" }} spacing={2}>
          <Box>
            <Box display="flex" sx={{ justifyContent: "center" }}>
              <img src={logo} style={{ borderRadius: "50%", width: "250px", height: "250px" }} alt="Steven's Headshot" />
            </Box>
            <Grid
              display="flex"
              justifyContent={{ xs: "center", sm: "center" }}
            >
              <Typography variant="h3">{import.meta.env.VITE_APP_NAME}</Typography>
            </Grid>
            <Grid
              display="flex"
              justifyContent={{ xs: "center", sm: "center" }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Software Engineer, UI/UX
                📍 San Francisco
              </Typography>
            </Grid>
            <Grid
              display="flex"
              justifyContent={{ xs: "center", sm: "center" }}
            >
              <Stack direction="row" spacing={0.4}>
                {links.map((link) => (
                  <Tooltip key={link.index} title={link.title} arrow>
                    <Link
                      target="_blank"
                      href={link.href}
                      underline="none"
                      color="inherit"
                    >
                      <IconButton size="large" color="inherit">{link.icon}</IconButton>
                    </Link>
                  </Tooltip>
                ))}
              </Stack>
            </Grid>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
