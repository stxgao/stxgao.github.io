import { Box, Grid, Link, Paper, Stack, Typography, useTheme } from '@mui/material';
import { VscRemote, VscError, VscWarning, VscBell, VscFeedback, VscCheck } from 'react-icons/vsc';
import { IoIosGitBranch } from 'react-icons/io';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="div"
      sx={{
        height: '100%',
        color: 'text.secondary',
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Remote Indicator */}
      <Box
        sx={{
          width: theme.layout.sidebarWidth,
          backgroundColor: theme.palette.footerRemoteBg,
          color: theme.palette.footerRemoteText,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          '&:hover': {
            background: theme.palette.footerRemoteHoverBg,
          },
        }}
      >
        <VscRemote fontSize="0.9rem" />
      </Box>

      {/* Left Section: Git Branch, Errors, Warnings */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          px: 1,
        }}
      >
        <Stack direction="row" spacing={0.5}>
          <Box
            component={Link}
            href="https://github.com/stxgao/stxgao.github.io"
            underline="none"
            color="text.secondary"
            target="_blank"
            display="flex"
            sx={{
              px: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                background: theme.palette.footerHoverBg,
              },
            }}
          >
            <IoIosGitBranch fontSize="0.9rem" />
            <Typography
              sx={{
                marginLeft: '2px',
                fontSize: theme.breakpoints.up('md') ? '0.7rem' : '0.6rem',
              }}
            >
              main
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              px: 0.5,
              cursor: 'pointer',
              '&:hover': {
                background: theme.palette.footerHoverBg,
              },
            }}
          >
            <Box
              display="flex"
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                py: 0.3,
              }}
            >
              <VscError fontSize="0.9rem" />
              <Typography
                sx={{
                  fontSize: theme.breakpoints.up('md') ? '0.7rem' : '0.6rem',
                  marginLeft: '2px',
                }}
              >
                0
              </Typography>
            </Box>

            <Box
              display="flex"
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                py: 0.3,
              }}
            >
              <VscWarning fontSize="0.9rem" />
              <Typography
                sx={{
                  fontSize: theme.breakpoints.up('md') ? '0.7rem' : '0.6rem',
                  marginLeft: '2px',
                }}
              >
                0
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Spacer to push right content */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Right Section: Prettier, Feedback, Bell */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          pr: 1.5,
        }}
      >
        <Stack direction="row" spacing={0.8}>
          <Box
            display="flex"
            sx={{
              px: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                background: theme.palette.footerHoverBg,
              },
            }}
          >
            <VscCheck fontSize="0.9rem" />
            <Typography
              sx={{
                fontSize: theme.breakpoints.up('md') ? '0.7rem' : '0.6rem',
                marginLeft: '3px',
              }}
            >
              Prettier
            </Typography>
          </Box>
          <Box
            display="flex"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              py: 0.3,
              px: 0.5,
              cursor: 'pointer',
              '&:hover': {
                background: theme.palette.footerHoverBg,
              },
            }}
          >
            <VscFeedback fontSize="0.9rem" />
          </Box>
          <Box
            display="flex"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              py: 0.3,
              px: 0.5,
              cursor: 'pointer',
              '&:hover': {
                background: theme.palette.footerHoverBg,
              },
            }}
          >
            <VscBell fontSize="0.9rem" />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
