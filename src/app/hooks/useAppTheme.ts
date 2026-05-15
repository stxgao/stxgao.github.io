import { createTheme, Theme, Components } from '@mui/material';
import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * Interface definitions for the VS Code-style Design System.
 */
export interface VsCodeLayout {
  tabHeight: string;
  sidebarWidth: string;
  footerHeight: string;
  panelMinWidth: string;
  statusBarLeftWidth: string;
}

/**
 * Interface for custom VS Code colors added to the MUI Palette.
 */
export interface CustomPalette {
  tabCloseHover: string;
  footerRemoteBg: string;
  footerRemoteHoverBg: string;
  footerHoverBg: string;
  footerRemoteText: string;
  scrollbarSlider: string;
  scrollbarSliderHover: string;
  markdownIcon: string;
}

const LAYOUT: VsCodeLayout = {
  tabHeight: '40px',
  sidebarWidth: '50px',
  footerHeight: '20px',
  panelMinWidth: '200px',
  statusBarLeftWidth: '200px',
};

/**
 * BRAND PALETTE (VS Code Blue Harmony)
 * We use different shades of the same Blue hue to ensure brand consistency
 * while maintaining WCAG contrast ratios across light and dark modes.
 */
const BRAND_BLUE = {
  light: '#295fbf', // Deep Navy (Contrast for light backgrounds)
  mid: '#1675e0', // Pure Brand Blue (Used for solid blocks like Footer)
  dark: '#3794ef', // Sky Blue (Contrast for dark backgrounds)
};

const SHARED = {
  footerRemoteBg: BRAND_BLUE.mid,
  footerRemoteHoverBg: '#2b8dfa',
  footerHoverBg: 'rgba(255, 255, 255, 0.1)',
  footerRemoteText: '#e1e1e1',
  markdownIcon: '#6997d5',
  transparent: 'rgba(0,0,0,0)',
};

const THEME_DATA = {
  dark: {
    ...SHARED,
    defaultBg: '#1e1e1e',
    panelBg: '#252527',
    selectionBg: 'rgba(144, 202, 249, 0.16)',
    hoverBg: 'rgba(255, 255, 255, 0.05)',
    activeText: '#e1e1e1',
    inactiveText: '#a6a6a6',
    divider: 'rgba(255, 255, 255, 0.12)',
    tabCloseHover: '#333c43',
    scrollbarSlider: 'rgba(121, 121, 121, 0.4)',
    scrollbarSliderHover: 'rgba(100, 100, 100, 0.7)',
    primaryMain: BRAND_BLUE.dark,
  },
  light: {
    ...SHARED,
    defaultBg: '#fafafa',
    panelBg: '#f3f3f3',
    selectionBg: 'rgba(0, 0, 0, 0.08)',
    hoverBg: 'rgba(0, 0, 0, 0.04)',
    activeText: '#333333',
    inactiveText: '#524a5f',
    divider: 'rgba(0, 0, 0, 0.12)',
    tabCloseHover: '#dadada',
    scrollbarSlider: 'rgba(100, 100, 100, 0.4)',
    scrollbarSliderHover: 'rgba(0, 0, 0, 0.6)',
    primaryMain: BRAND_BLUE.light,
  },
};

const getScrollbarStyles = (
  colors: any,
): Components<Omit<Theme, 'components'>>['MuiCssBaseline'] => ({
  styleOverrides: {
    '*::-webkit-scrollbar': { width: '3px', height: '3px' },
    '*::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: colors.scrollbarSlider,
      '&:hover, &:active': { backgroundColor: colors.scrollbarSliderHover },
    },
  },
});

function buildTheme(mode: 'dark' | 'light'): Theme {
  const theme = THEME_DATA[mode];

  return createTheme({
    palette: {
      mode,
      primary: { main: theme.primaryMain },
      background: { default: theme.defaultBg, paper: theme.panelBg },
      text: { primary: theme.activeText, secondary: theme.inactiveText },
      action: { hover: theme.hoverBg, selected: theme.selectionBg },
      divider: theme.divider,
      // Flattened custom colors
      tabCloseHover: theme.tabCloseHover,
      footerRemoteBg: theme.footerRemoteBg,
      footerRemoteHoverBg: theme.footerRemoteHoverBg,
      footerHoverBg: theme.footerHoverBg,
      footerRemoteText: theme.footerRemoteText,
      scrollbarSlider: theme.scrollbarSlider,
      scrollbarSliderHover: theme.scrollbarSliderHover,
      markdownIcon: theme.markdownIcon,
    },
    layout: LAYOUT,
    shape: { borderRadius: 4 },
    components: {
      MuiPaper: { defaultProps: { elevation: 0, square: true } },
      MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
      MuiCssBaseline: getScrollbarStyles(theme),
    },
  });
}

export function useAppTheme() {
  const { isDarkMode } = useAppStore();
  const theme = useMemo(() => buildTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode]);
  return { theme };
}

declare module '@mui/material/styles' {
  interface Theme {
    layout: VsCodeLayout;
  }
  interface ThemeOptions {
    layout?: VsCodeLayout;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends Partial<CustomPalette> {}
}
