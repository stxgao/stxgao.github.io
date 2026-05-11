import { create } from 'zustand';
import { isBrowser, isMobile } from 'react-device-detect';
import { NavigateFunction } from 'react-router-dom';
import { pages } from '../constants/pages';

/**
 * Represents a single routeable page within the application.
 */
export interface Page {
  /**
   * The unique identifier index for the page.
   */
  index: number;

  /**
   * The display name of the page.
   */
  name: string;

  /**
   * The URL route path associated with the page.
   */
  route: string;

  /**
   * Determines if the page is visible in the file explorer.
   */
  visible: boolean;
}

/**
 * Global Zustand store state interface modeling the frontend IDE's state.
 */
interface AppState {
  /**
   * Specifies whether the application is running on a mobile device.
   */
  isMobile: boolean;

  /**
   * Specifies whether the left side file explorer is expanded.
   * @default isBrowser (true on desktop, false on mobile)
   */
  expanded: boolean;

  /**
   * Tracks the index of the currently active/focused file tab.
   * @remarks
   * Values mapping:
   * - `-1`: Home / no-tab active
   * - `0`: Docs
   * - `> 0`: Real file tabs
   * @default -1
   */
  selectedIndex: number;

  /**
   * Tracks the last component type interacted with.
   * @default ''
   */
  currentComponent: string;

  /**
   * Array of active page indices representing currently open tabs.
   */
  visiblePageIndexes: number[];

  /**
   * Chronological stack tracking historical focus to mimic VSCode tab history.
   * @internal
   */
  tabHistory: number[];

  /**
   * Specifies whether the application is in dark mode globally.
   * @remarks Value determined by localStorage or system preference on load.
   */
  isDarkMode: boolean;

  /**
   * Sets the expansion state of the sidebar file explorer.
   *
   * @param expanded - The new expansion state.
   */
  setExpanded: (expanded: boolean) => void;

  /**
   * Sets the currently active/focused file tab.
   *
   * @param index - The index of the selected file.
   */
  setSelectedIndex: (index: number) => void;

  /**
   * Updates the tracker for the last interacted component.
   *
   * @param component - The identifier string of the component.
   */
  setCurrentComponent: (component: string) => void;

  /**
   * Overwrites the active tabs being displayed in the editor tray.
   *
   * @param indexes - The new array of visible page indices.
   */
  setVisiblePageIndexes: (indexes: number[]) => void;

  /**
   * Toggles the global theme and persists the user's preference to localStorage.
   */
  toggleTheme: () => void;

  /**
   * Selects a file/tab, opens it if not visible, and navigates to its route.
   * @remarks
   * This is a composite action that encapsulates `setSelectedIndex`, updates internal properties, and handles routing.
   *
   * @param index - The page index to activate.
   * @param navigate - React Router navigate function.
   * @param component - The source component identifier (e.g. 'tab', 'tree').
   */
  selectTab: (index: number, navigate: NavigateFunction, component?: string) => void;

  /**
   * Closes a file/tab and navigates away if necessary.
   * @remarks
   * Implements VSCode's 'focusRecentEditorAfterClose' behavior.
   * If the closed tab was active, it falls back to the most recently used (MRU) tab via `tabHistory`.
   *
   * @param index - The page index to close.
   * @param navigate - React Router navigate function.
   */
  closeTab: (index: number, navigate: NavigateFunction) => void;

  /**
   * The current width of the side panel in pixels.
   */
  panelWidth: number;

  /**
   * Updates the side panel width and persists it to localStorage.
   */
  setPanelWidth: (width: number) => void;
}

/**
 * Calculate open tabs on first load using pages explicitly defined as visible.
 */
const initialVisibleIndexes: number[] = pages
  .filter((page) => page.visible)
  .map((page) => page.index);

/**
 * Zustand hook defining the application UI's central control state.
 * Accessible from any component directly without prop drilling.
 */
export const useAppStore = create<AppState>()((set) => ({
  isMobile: isMobile,
  expanded: isBrowser,
  selectedIndex: -1,
  currentComponent: '',
  visiblePageIndexes: initialVisibleIndexes,
  tabHistory: initialVisibleIndexes,
  isDarkMode: (() => {
    const theme = localStorage.getItem('theme');
    return theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  })(),
  panelWidth: parseInt(localStorage.getItem('panelWidth') || '250'),

  setExpanded: (expanded) => set({ expanded }),
  setPanelWidth: (panelWidth) => {
    localStorage.setItem('panelWidth', panelWidth.toString());
    set({ panelWidth });
  },
  setSelectedIndex: (selectedIndex) =>
    set((state) => ({
      selectedIndex,
      // Only track real file tabs (> 0) in MRU history; -1 means Home/no-tab, 0 means docs
      tabHistory:
        selectedIndex > 0
          ? [...state.tabHistory.filter((id) => id !== selectedIndex), selectedIndex]
          : state.tabHistory,
    })),
  setCurrentComponent: (currentComponent) => set({ currentComponent }),
  setVisiblePageIndexes: (visiblePageIndexes) =>
    set((state) => ({
      visiblePageIndexes,
      tabHistory: state.tabHistory.filter((id) => visiblePageIndexes.includes(id)),
    })),
  toggleTheme: () =>
    set((state) => {
      const isDarkMode = !state.isDarkMode;
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      return { isDarkMode };
    }),

  selectTab: (index, navigate, component = 'tab') => {
    const page = pages.find((p) => p.index === index);
    if (!page) return;
    navigate(page.route);
    set((state) => ({
      selectedIndex: index,
      currentComponent: component,
      visiblePageIndexes: state.visiblePageIndexes.includes(index)
        ? state.visiblePageIndexes
        : [...state.visiblePageIndexes, index],
      tabHistory: [...state.tabHistory.filter((id) => id !== index), index],
    }));
  },

  closeTab: (index, navigate) => {
    set((state) => {
      const newVisible = state.visiblePageIndexes.filter((x) => x !== index);
      const newHistory = state.tabHistory.filter((x) => x !== index);

      if (newVisible.length === 0) {
        navigate('/');
        return { visiblePageIndexes: newVisible, tabHistory: newHistory, selectedIndex: -1 };
      }

      if (state.selectedIndex === index) {
        // VSCode MRU fallback: pick the most recently used remaining tab
        const fallbackIndex =
          newHistory.length > 0
            ? newHistory[newHistory.length - 1]
            : newVisible[newVisible.length - 1];
        const fallbackPage = pages.find((p) => p.index === fallbackIndex);
        if (fallbackPage) navigate(fallbackPage.route);
        return {
          visiblePageIndexes: newVisible,
          tabHistory: newHistory,
          selectedIndex: fallbackIndex,
        };
      }

      // Closing a background tab — no navigation needed
      return { visiblePageIndexes: newVisible, tabHistory: newHistory };
    });
  },
}));
