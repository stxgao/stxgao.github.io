import { Button, Box, IconButton, Typography } from '@mui/material';
import { VscMarkdown, VscChromeClose } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAppStore, Page } from '../store/useAppStore';

interface Props {
  pages: Page[];
}

export default function AppTabs({ pages }: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { selectedIndex, selectTab, closeTab } = useAppStore();

  function getTabStyles(isSelected: boolean) {
    return {
      tabBg: isSelected ? 'background.default' : 'background.paper',
      tabColor: isSelected ? 'text.primary' : 'text.secondary',
      closeColor: isSelected ? 'text.primary' : 'transparent',
    };
  }

  function renderTab(index: number, selectedIndex: number, name: string, route: string) {
    const isSelected = selectedIndex === index;
    const styles = getTabStyles(isSelected);

    return (
      <Box
        key={index}
        sx={{
          display: 'flex',
          flexShrink: 0,
          borderRight: 1,
          borderColor: 'divider',
        }}
        role="tab"
        aria-selected={isSelected}
      >
        <Button
          onClick={() => selectTab(index, navigate)}
          onAuxClick={(e) => {
            if (e.button === 1) {
              e.preventDefault();
              closeTab(index, navigate);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Delete' || (e.key === 'w' && (e.ctrlKey || e.metaKey))) {
              if (e.key === 'w') e.preventDefault(); // Note: browsers usually block Ctrl+W
              closeTab(index, navigate);
            }
          }}
          sx={{
            borderRadius: 0,
            px: 2,
            height: `calc(${theme.layout.tabHeight} - 1px)`,
            backgroundColor: styles.tabBg,
            color: styles.tabColor,
            '&.MuiButtonBase-root:hover': {
              bgcolor: 'background.default',
              color: 'text.primary',
              '& .close-icon': {
                color: 'text.primary',
              },
            },
            transition: 'none',
            display: 'flex',
            alignItems: 'center',
            textTransform: 'none',
          }}
        >
          <Box
            sx={{
              color: 'markdownIcon',
              width: 20,
              height: 20,
              mr: 0.4,
              ml: -1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <VscMarkdown />
          </Box>
          <Typography>{name}</Typography>
          <IconButton
            className="close-icon"
            size="small"
            tabIndex={-1}
            sx={{
              ml: 1,
              mr: -1,
              p: 0.2,
              borderRadius: 1, // 4px rounding
              color: styles.closeColor,
              '&:hover': {
                bgcolor: 'tabCloseHover',
                color: 'text.primary',
              },
              transition: 'none',
            }}
            onClick={(e) => {
              e.stopPropagation();
              closeTab(index, navigate);
            }}
            aria-label={`Close ${name} tab`}
          >
            <VscChromeClose fontSize="1rem" />
          </IconButton>
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        backgroundColor: 'background.paper',
        height: '100%',
        borderBottom: 1,
        borderColor: 'divider',
        '&::-webkit-scrollbar': {
          height: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'divider',
        },
      }}
      role="tablist"
      aria-label="Editor tabs"
    >
      {pages.map(({ index, name, route }) => renderTab(index, selectedIndex, name, route))}
    </Box>
  );
}
