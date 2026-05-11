import { Box, Grid, IconButton, Link, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import logo from '../../static/favicon.png';
import { useLocation } from 'react-router-dom';
import { links } from '../constants/links';
import { useAppStore } from '../store/useAppStore';

export default function Home() {
  const { pathname } = useLocation();
  const { setSelectedIndex, isMobile, setIsSidebarExpanded } = useAppStore();
  const theme = useTheme();

  useEffect(() => {
    setSelectedIndex(-1);
    if (isMobile) {
      setIsSidebarExpanded(false);
    }
  }, [setSelectedIndex, isMobile, setIsSidebarExpanded]);

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
      sx={{ height: '100%' }}
    >
      <Grid item xs={3}>
        <Stack direction={{ xs: 'column', sm: 'row-reverse' }} spacing={2}>
          <Box>
            <Box display="flex" sx={{ justifyContent: 'center' }}>
              <img
                src={logo}
                style={{ borderRadius: '50%', width: '250px', height: '250px' }}
                alt="Steven's Headshot"
              />
            </Box>
            <Grid display="flex" justifyContent={{ xs: 'center', sm: 'center' }}>
              <Typography variant="h3" sx={{ color: 'text.primary' }}>
                {import.meta.env.VITE_APP_NAME}
              </Typography>
            </Grid>
            <Grid display="flex" justifyContent={{ xs: 'center', sm: 'center' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
                Software Engineer, UI/UX 📍 San Francisco
              </Typography>
            </Grid>
            <Grid display="flex" justifyContent={{ xs: 'center', sm: 'center' }}>
              <Stack direction="row" spacing={0.4}>
                {links.map((link) => (
                  <Tooltip key={link.index} title={link.title} arrow>
                    <IconButton
                      component="a"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="large"
                      onKeyDown={(e) => {
                        if (e.key === ' ') {
                          e.preventDefault();
                          window.open(link.href, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'text.primary',
                        },
                      }}
                      aria-label={link.title}
                    >
                      {link.icon}
                    </IconButton>
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
