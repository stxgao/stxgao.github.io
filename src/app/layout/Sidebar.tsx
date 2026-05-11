import { Box, IconButton, Link, Tooltip, useTheme } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { VscFiles, VscSettingsGear } from 'react-icons/vsc';
import { AiOutlineRobot } from 'react-icons/ai';
import { BiGitBranch } from 'react-icons/bi';
import Divider from '@mui/material/Divider';
import { links } from '../constants/links';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function Sidebar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === 'dark';

  const { expanded, setExpanded, toggleTheme, setSelectedIndex, selectedIndex, isMobile } =
    useAppStore();

  const getIconButtonStyle = (isActive: boolean) => ({
    borderRadius: 0,
    width: '100%',
    py: 1.5,
    fontSize: 24,
    color: isActive ? 'text.primary' : 'text.secondary',
    borderLeft: isActive
      ? `solid 0.12em ${theme.palette.primary.main}`
      : `solid 0.12em transparent`,
    '&:hover': {
      color: 'text.primary',
      backgroundColor: 'transparent',
    },
  });

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      component="nav"
      aria-label="Main Sidebar"
    >
      <Box sx={{ flexGrow: 0, display: 'flex', flexDirection: 'column' }}>
        <Tooltip title="Explorer" arrow placement="right">
          <IconButton
            aria-label="Toggle Explorer Panel"
            onClick={() => setExpanded(!expanded)}
            sx={getIconButtonStyle(expanded)}
            aria-expanded={expanded}
          >
            <VscFiles />
          </IconButton>
        </Tooltip>

        <Tooltip title="Source Control" arrow placement="right">
          <IconButton
            component="a"
            href="https://github.com/stxgao/stxgao.github.io"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Source Code on GitHub"
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault();
                window.open(
                  'https://github.com/stxgao/stxgao.github.io',
                  '_blank',
                  'noopener,noreferrer',
                );
              }
            }}
            sx={{
              borderRadius: 0,
              width: '100%',
              py: 1.5,
              fontSize: 24,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                backgroundColor: 'transparent',
              },
            }}
          >
            <BiGitBranch />
          </IconButton>
        </Tooltip>

        <Divider sx={{ m: 0.5 }} />

        {links.map((link) => (
          <Tooltip title={link.title} arrow placement="right" key={link.index}>
            <IconButton
              component="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.title}
              onKeyDown={(e) => {
                if (e.key === ' ') {
                  e.preventDefault();
                  window.open(link.href, '_blank', 'noopener,noreferrer');
                }
              }}
              sx={{
                borderRadius: 0,
                width: '100%',
                py: 1.5,
                fontSize: 24,
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'transparent',
                },
              }}
            >
              {link.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Box sx={{ flexGrow: 0, pb: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Tooltip
          title={isDarkTheme ? 'Turn on the light' : 'Turn off the light'}
          placement="right"
          arrow
        >
          <IconButton
            aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            sx={{
              borderRadius: 0,
              width: '100%',
              py: 1.5,
              fontSize: 24,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                backgroundColor: 'transparent',
              },
            }}
          >
            {isDarkTheme ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Markdown syntax" arrow placement="right">
          <IconButton
            aria-label="View Markdown Documentation"
            onClick={() => {
              if (selectedIndex === 0 && isMobile) {
                setExpanded(false);
                return;
              }
              setSelectedIndex(0);
              navigate('/docs');
            }}
            sx={{
              borderRadius: 0,
              width: '100%',
              py: 1.5,
              fontSize: 24,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                backgroundColor: 'transparent',
              },
            }}
          >
            <VscSettingsGear />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
