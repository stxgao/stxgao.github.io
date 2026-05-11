import { Theme } from '@mui/material';
import { useAppStore } from '../store/useAppStore';

/**
 * Custom hook to manage the resizable side panel logic.
 * Handles mouse events and state updates for the panel width.
 */
export function usePanelResize(theme: Theme) {
  const { panelWidth, setPanelWidth, isMobile } = useAppStore();
  const PANEL_MIN_WIDTH_VAL = parseInt(theme.layout.panelMinWidth);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    const startX = e.clientX;
    const startWidth = panelWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const maxAllowedWidth = window.innerWidth / 2;
      const newWidth = Math.min(
        Math.max(startWidth + (moveEvent.clientX - startX), PANEL_MIN_WIDTH_VAL),
        maxAllowedWidth,
      );
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  return { handleMouseDown };
}
