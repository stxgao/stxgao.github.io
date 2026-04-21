import * as React from "react";
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import { VscMarkdown } from "react-icons/vsc";
import { useAppStore } from "../store/useAppStore";
import { pages } from "../pages/pages";

export default function AppTree() {
  const visiblePages = pages.filter((x) => x.visible);
  const navigate = useNavigate();
  const theme = useTheme();
  const { selectedIndex, currentComponent, selectTab, setSelectedIndex } = useAppStore();

  function renderTreeItemBgColor(index: number) {
    if (theme.palette.mode === "dark") {
      return selectedIndex === index ? "rgba(144,202,249,0.16)" : "#252527";
    } else {
      return selectedIndex === index ? "#295fbf" : "#f3f3f3";
    }
  }

  function renderTreeItemColor(index: number) {
    if (theme.palette.mode === "dark") {
      return selectedIndex === index && currentComponent === "tree"
        ? "white"
        : "#bdc3cf";
    } else {
      return selectedIndex === index ? "#e2ffff" : "#69665f";
    }
  }

  function clickHandler(event: React.SyntheticEvent, nodeId: string) {
    const index = parseInt(nodeId);
    if (index === -1) {
      navigate("/");
      setSelectedIndex(-1);
    } else {
      selectTab(index, navigate, 'tree');
    }
  }

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ minWidth: 220, minHeight: 200, flexGrow: 1 }}
      expanded={["-1"]}
      onNodeSelect={clickHandler}
    >
      <TreeItem
        key={-1}
        nodeId="-1"
        label="Home"
        color="#bdc3cf"
        aria-label="View Home Page"
        aria-selected={selectedIndex === -1}
      >
        {visiblePages.map(({ index, name }) => (
          <TreeItem
            key={index}
            nodeId={index.toString()}
            label={name}
            sx={{
              color: renderTreeItemColor(index),
              backgroundColor: renderTreeItemBgColor(index),
              "&& .Mui-selected": {
                backgroundColor: renderTreeItemBgColor(index),
              },
            }}
            icon={<VscMarkdown color="#6997d5" />}
            aria-selected={selectedIndex === index}
          />
        ))}
      </TreeItem>
    </TreeView>
  );
}
