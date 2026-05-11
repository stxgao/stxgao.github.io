import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
   * Specifies whether the sidebar panel is expanded.
   * @default isBrowser (true on desktop, false on mobile)
   */
  isSidebarExpanded: boolean;

  /**
   * Tracks the active panel in the sidebar.
   */
  activePanel: 'explorer' | 'aiAssistant';

  /**
   * The current width of the side panel in pixels.
   */
  panelWidth: number;

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
   * @remarks Value persisted across sessions and respects system preference as a fallback.
   */
  isDarkMode: boolean;

  /**
   * Cached content of the markdown pages.
   */
  pageContents: Record<string, string>;

  /**
   * Preloads all markdown pages into memory.
   */
  preloadPages: () => Promise<void>;

  /**
   * Sets the expansion state of the side panel.
   *
   * @param isSidebarExpanded - The new expansion state.
   */
  setIsSidebarExpanded: (isSidebarExpanded: boolean) => void;

  /**
   * Sets the active panel in the sidebar.
   */
  setActivePanel: (panel: 'explorer' | 'aiAssistant') => void;

  /**
   * Updates the side panel width.
   */
  setPanelWidth: (width: number) => void;

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
   * Toggles the global theme and persists the user's preference.
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
}

/**
 * Calculate open tabs on first load using pages explicitly defined as visible.
 */
const initialVisibleIndexes: number[] = pages
  .filter((page) => page.visible)
  .map((page) => page.index);

/**
 * Defines which parts of the AppState should be persisted to localStorage.
 */
const getPersistentState = (state: AppState) => ({
  activePanel: state.activePanel,
  isDarkMode: state.isDarkMode,
  panelWidth: state.panelWidth,
  visiblePageIndexes: state.visiblePageIndexes,
  tabHistory: state.tabHistory,
});

/**
 * Zustand hook defining the application UI's central control state.
 * Accessible from any component directly without prop drilling.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isMobile: isMobile,
      isSidebarExpanded: isBrowser,
      activePanel: 'explorer',
      selectedIndex: -1,
      currentComponent: '',
      visiblePageIndexes: initialVisibleIndexes,
      tabHistory: initialVisibleIndexes,
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      panelWidth: 250,
      pageContents: {},

      preloadPages: async () => {
        const { pageContents } = get();
        // Skip if already loaded
        if (Object.keys(pageContents).length >= pages.length) return;

        const results = await Promise.all(
          pages.map(async (page) => {
            try {
              const res = await fetch(`/pages/${page.name}`);
              if (res.ok) {
                const text = await res.text();
                return { name: page.name, text };
              }
            } catch (e) {
              console.error(`Failed to preload ${page.name}`, e);
            }
            return null;
          }),
        );

        const newContents: Record<string, string> = {};
        results.forEach((res) => {
          if (res) newContents[res.name] = res.text;
        });

        set({ pageContents: newContents });
      },

      setIsSidebarExpanded: (isSidebarExpanded) => set({ isSidebarExpanded }),
      setPanelWidth: (panelWidth) => {
        set({ panelWidth });
      },
      setActivePanel: (activePanel) => {
        set({ activePanel });
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
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

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
    }),
    {
      name: 'stxgao-workbench-state',
      partialize: getPersistentState,
    },
  ),
);
