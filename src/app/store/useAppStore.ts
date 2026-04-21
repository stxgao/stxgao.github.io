import { create } from 'zustand';
import { isBrowser } from 'react-device-detect';
import { NavigateFunction } from 'react-router-dom';
import { pages } from '../pages/pages';

/**
 * Represents a single routeable page within the application.
 * @interface Page
 * @property {number} index - The unique identifier index for the page.
 * @property {string} name - The display name of the page.
 * @property {string} route - The URL route path associated with the page.
 * @property {boolean} visible - Determines if the page is visible in the file explorer.
 */
export interface Page {
  index: number;
  name: string;
  route: string;
  visible: boolean;
}

/**
 * Global Zustand store state interface modeling the frontend IDE's state.
 * @interface AppState
 */
interface AppState {
  /** Specifies whether the left side file explorer is expanded */
  expanded: boolean;
  /** Tracks the index of the currently active/focused file tab */
  selectedIndex: number;
  /**
   * Tracks the last component type interacted with.
   * @type {string}
   */
  currentComponent: string;
  /**
   * Array of active page indices representing currently open tabs.
   * @type {number[]}
   */
  visiblePageIndexes: number[];
  /**
   * Chronological stack tracking historical focus to mimic VSCode tab history.
   * @type {number[]}
   */
  tabHistory: number[];
  /**
   * Specifies whether the application is in dark mode globally.
   * @type {boolean}
   */
  darkMode: boolean;

  /**
   * Sets the expansion state of the sidebar file explorer.
   * @param {boolean} expanded - The new expansion state.
   */
  setExpanded: (expanded: boolean) => void;
  /**
   * Sets the currently active/focused file tab.
   * @param {number} index - The index of the selected file.
   */
  setSelectedIndex: (index: number) => void;
  /**
   * Updates the tracker for the last interacted component.
   * @param {string} component - The identifier string of the component.
   */
  setCurrentComponent: (component: string) => void;
  /**
   * Overwrites the active tabs being displayed in the editor tray.
   * @param {number[]} indexes - The new array of visible page indices.
   */
  setVisiblePageIndexes: (indexes: number[]) => void;
  /**
   * Sets the global dark mode state.
   * @param {boolean} darkMode - The target dark mode boolean state.
   */
  setDarkMode: (darkMode: boolean) => void;

  /**
   * Toggles the global theme and persists the user's preference to localStorage.
   */
  toggleTheme: () => void;

  /**
   * Selects a file/tab, opens it if not visible, and navigates to its route.
   * Encapsulates setSelectedIndex + setVisiblePageIndexes + setCurrentComponent + navigate.
   * @param {number} index - The page index to activate.
   * @param {NavigateFunction} navigate - React Router navigate function.
   * @param {string} [component] - The source component identifier (e.g. 'button', 'tree').
   */
  selectTab: (index: number, navigate: NavigateFunction, component?: string) => void;

  /**
   * Closes a file/tab and navigates to the most recently used (MRU) file/tab.
   * Implements VSCode's 'focusRecentEditorAfterClose' behavior using tabHistory.
   * @param {number} index - The page index to close.
   * @param {NavigateFunction} navigate - React Router navigate function.
   */
  closeTab: (index: number, navigate: NavigateFunction) => void;
}

/** 
 * Calculate open tabs on first load using pages explicitly defined as visible.
 * @type {number[]}
 */
const initialVisibleIndexes = pages
  .filter((page) => page.visible)
  .map((page) => page.index);

/**
 * Zustand hook defining the application UI's central control state.
 * Accessible from any component directly without prop drilling.
 */
export const useAppStore = create<AppState>()((set) => ({
  expanded: isBrowser,
  selectedIndex: -1,
  currentComponent: '',
  visiblePageIndexes: initialVisibleIndexes,
  tabHistory: initialVisibleIndexes,
  darkMode: (() => {
    const theme = localStorage.getItem('theme');
    return theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  })(),

  setExpanded: (expanded) => set({ expanded }),
  setSelectedIndex: (selectedIndex) => set((state) => ({
    selectedIndex,
    // Only track real file tabs (> 0) in MRU history; -1 means Home/no-tab, 0 means docs
    tabHistory: selectedIndex > 0
      ? [...state.tabHistory.filter((id) => id !== selectedIndex), selectedIndex]
      : state.tabHistory,
  })),
  setCurrentComponent: (currentComponent) => set({ currentComponent }),
  setVisiblePageIndexes: (visiblePageIndexes) => set((state) => ({
    visiblePageIndexes,
    tabHistory: state.tabHistory.filter((id) => visiblePageIndexes.includes(id))
  })),
  setDarkMode: (darkMode) => set({ darkMode }),
  toggleTheme: () => set((state) => {
    const newDarkMode = !state.darkMode;
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    return { darkMode: newDarkMode };
  }),

  selectTab: (index, navigate, component = 'button') => {
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
    const state = useAppStore.getState();
    const newVisible = state.visiblePageIndexes.filter((x) => x !== index);
    const newHistory = state.tabHistory.filter((x) => x !== index);

    if (newVisible.length === 0) {
      navigate('/');
      set({ visiblePageIndexes: newVisible, tabHistory: newHistory, selectedIndex: -1 });
      return;
    }

    if (state.selectedIndex === index) {
      // VSCode MRU fallback: pick the most recently used remaining tab
      const fallbackIndex = newHistory.length > 0
        ? newHistory[newHistory.length - 1]
        : newVisible[newVisible.length - 1];
      const fallbackPage = pages.find((p) => p.index === fallbackIndex);
      if (fallbackPage) navigate(fallbackPage.route);
      set({ visiblePageIndexes: newVisible, tabHistory: newHistory, selectedIndex: fallbackIndex });
      return;
    }

    // Closing a background tab — no navigation needed
    set({ visiblePageIndexes: newVisible, tabHistory: newHistory });
  },
}));
