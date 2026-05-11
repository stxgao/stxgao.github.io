import React from 'react';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { VscMarkdown } from 'react-icons/vsc';
import { Typography, Box } from '@mui/material';
import { useAppStore } from '../store/useAppStore';
import { pages } from '../constants/pages';

export default function AppTree() {
  const visiblePages = pages.filter((x) => x.visible);
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    selectedIndex,
    currentComponent,
    selectTab,
    setSelectedIndex,
    setIsSidebarExpanded,
    isMobile,
  } = useAppStore();

  const getItemColor = (index: number) => {
    const isSelected = selectedIndex === index;
    const isTreeActive = currentComponent === 'tree';
    // Only use active text color if selected AND the tree is the active component
    return isSelected && isTreeActive ? 'text.primary' : 'text.secondary';
  };

  function clickHandler(event: React.SyntheticEvent, nodeId: string) {
    const index = parseInt(nodeId);

    // If already on this page, just close the sidebar on mobile
    if (index === selectedIndex) {
      if (isMobile) {
        // Wait a frame to ensure any hover states are cleared
        requestAnimationFrame(() => {
          setIsSidebarExpanded(false);
        });
      }
      return;
    }

    if (index === -1) {
      navigate('/');
      setSelectedIndex(-1);
    } else {
      selectTab(index, navigate, 'tree');
    }
  }

  const renderHomeLabel = (text: string) => (
    <Typography fontWeight="bold" sx={{ color: 'text.secondary' }}>
      {text}
    </Typography>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          height: theme.layout.tabHeight,
          display: 'flex',
          alignItems: 'center',
          ml: 3,
          py: 1,
          flexShrink: 0,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          EXPLORER
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          selected={selectedIndex.toString()}
          sx={{
            minWidth: 200,
            flexGrow: 1,
            // Remove the default indentation of nested groups to allow full-width background
            '& .MuiTreeItem-group': {
              ml: 0,
            },
            // Apply manual indentation to the content via padding
            '& .MuiTreeItem-root .MuiTreeItem-group .MuiTreeItem-content': {
              pl: 3,
            },
            // Shift the root HOME item back 8px
            '& > .MuiTreeItem-root > .MuiTreeItem-content': {
              pl: 0,
            },
            // Center the chevron icon by shifting it right by 4px
            '& > .MuiTreeItem-root:first-of-type > .MuiTreeItem-content .MuiTreeItem-iconContainer':
              {
                pl: 1,
              },
            // Ensure text starts exactly after the 24px icon container
            '& .MuiTreeItem-label': {
              pl: 0,
            },
            // Centralized background styling to prevent double-hover/conflicts
            '& .MuiTreeItem-content': {
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              },
            },
          }}
          defaultExpanded={['-1']}
          onNodeSelect={clickHandler}
        >
          <TreeItem
            key={-1}
            nodeId="-1"
            label={renderHomeLabel('HOME')}
            aria-label="View Home Page"
            sx={{ color: 'text.secondary' }}
          >
            {visiblePages.map(({ index, name }) => {
              return (
                <TreeItem
                  key={index}
                  nodeId={index.toString()}
                  label={name}
                  sx={{ color: getItemColor(index) }}
                  icon={<VscMarkdown color={theme.palette.markdownIcon} />}
                />
              );
            })}
          </TreeItem>
        </TreeView>
      </Box>
    </Box>
  );
}
