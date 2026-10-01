import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import styles from "../../Styles/SidekickMenu.module.css";
import { ISidekickMenuItem, SidekickMenuProps } from "./types";
import { extractTextFromReactNode } from "../../utils/reactNodeUtils";

// Context and Reducer
import { MenuContext, menuReducer, MenuState } from "./context/MenuContext";

// Hooks
import { useItemVisibility } from "./hooks/useItemVisibility";
import { useFocusTrap } from "./hooks/useFocusTrap";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useDrilldownKeyboardNavigation } from "./hooks/useDrilldownKeyboardNavigation";
import { useFavourites } from "./hooks/useFavourites";
import { useSwipeGesture } from "./hooks/useSwipeGesture";
import { useNumberedShortcuts } from "./hooks/useNumberedShortcuts";

// Utils
import { validateItemIds, validateDescriptions } from "./utils/validation";
import { findItemById, getBreadcrumbPath } from "./utils/breadcrumb";
import { getStorageKey, registerNamespaceUsage } from "./utils/namespace";
import { getFilteredItems } from "./utils/search";
import { getValidPathPrefix, readLastPosition, writeLastPosition } from "./utils/lastPosition";

// Components
import MenuList from "./components/MenuList";
import DrilldownMenuList from "./components/DrilldownMenuList";
import MenuBreadcrumb from "./components/MenuBreadcrumb";
import TabSwitcher from "./components/TabSwitcher";
import FavouritesList from "./components/FavouritesList";

// Theming / config
import { useZestConfig } from "../hooks/useZestConfig";
import { useThemeDetection } from "../hooks/useThemeDetection";

const isRtlDocument = () =>
  typeof document !== "undefined" && document.documentElement.dir === "rtl";

const SidekickMenu: React.FC<SidekickMenuProps> = (props) => {
  const {
    items,
    searchEnabled = true,
    searchAutoFocus = true,
    searchPlaceholder = "Search menu...",
    alwaysShowUnsearchableItems = true,
    openOnDesktop = false,
    searchIcon,
    chevronIcon,
    headerContent,
    footerContent,
    cacheLifetime = 24,
    side = "left",
    zest: localZestProps,
    navigationStyle = "drilldown",
    favouritesEnabled = false,
    favouritesOptions,
    storageNamespace,
    railCollapsible = false,
    swipeEnabled = false,
    numberedShortcutsEnabled = true,
    rememberPosition = true,
  } = props;

  const {
    theme = "system",
    motionOptions = {},
    visualOptions = {},
  } = useZestConfig(localZestProps);
  const systemTheme = useThemeDetection();
  const effectiveTheme = theme === "system" ? systemTheme : theme;
  const motionIntensity = motionOptions.intensity ?? "playful";
  const surface = visualOptions.surface ?? "solid";

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const effectiveSide =
    side === "auto" ? (isMobile || isRtlDocument() ? "right" : "left") : side;

  const initialState: MenuState = {
    isOpen: false,
    searchTerm: "",
    highlightedIndex: -1,
    openSubMenus: {},
    itemVisibility: {},
    currentPath: [],
    activeTab: "all",
    railCollapsed: false,
  };

  const [state, dispatch] = useReducer(menuReducer, initialState);
  const {
    isOpen,
    searchTerm,
    openSubMenus,
    highlightedIndex,
    itemVisibility,
    currentPath,
    activeTab,
    railCollapsed,
  } = state;

  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      validateItemIds(items);
      validateDescriptions(items);
    }
  }, [items]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && navigationStyle === "accordion") {
      console.warn(
        "[SidekickMenu] navigationStyle=\"accordion\" is deprecated: it will receive no new features and " +
          "is scheduled for removal after 25 published releases (see docs/breaking-changes.md for the running " +
          "count). Migrate to the default \"drilldown\" navigation style when convenient."
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const namespaceKey = getStorageKey("usageStats", storageNamespace);
    return registerNamespaceUsage(namespaceKey, items);
  }, [storageNamespace, items]);

  const visibility = useItemVisibility(items, cacheLifetime, storageNamespace);
  useEffect(() => {
    dispatch({ type: "SET_ITEM_VISIBILITY", payload: visibility });
  }, [visibility]);

  useFocusTrap(menuRef, isOpen);

  const favourites = useFavourites(items, itemVisibility, favouritesOptions, storageNamespace);

  // Restore the tab the user was last on (defaults to "All"). Read after mount, like the rail state,
  // so server and first client render agree.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(getStorageKey("activeTab", storageNamespace));
      if (stored === "favourites" || stored === "all") {
        dispatch({ type: "SET_ACTIVE_TAB", payload: stored });
      }
    } catch {
      // ignore read errors, fall back to default ("all")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeTab = (tab: "favourites" | "all") => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: tab });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(getStorageKey("activeTab", storageNamespace), tab);
      } catch {
        // ignore write errors
      }
    }
  };

  const closeMenu = () => dispatch({ type: "CLOSE_MENU" });

  const handleActivateItem = (item: ISidekickMenuItem) => {
    favourites.recordUsage(item.id);
    // Only browsing the "All" tree sets the remembered position; picking from Favourites says
    // nothing about where in the tree the user is working.
    if (rememberPosition && navigationStyle === "drilldown" && !showingFavourites) {
      writeLastPosition(items, item.id, storageNamespace);
    }
    if (item.path) {
      window.location.assign(item.path);
    } else if (item.onClick) {
      item.onClick();
    }
    closeMenu();
  };

  const handleDrillIn = (id: string) => dispatch({ type: "DRILL_IN", payload: id });

  const handleTogglePin = (id: string) =>
    favourites.isPinned(id) ? favourites.unpinItem(id) : favourites.pinItem(id);

  const currentLevelItems = useMemo(() => {
    if (currentPath.length === 0) return items;
    const currentItem = findItemById(items, currentPath[currentPath.length - 1]);
    return currentItem?.children ?? [];
  }, [items, currentPath]);

  const breadcrumbPath = useMemo(() => {
    if (currentPath.length === 0) return [];
    const ancestors = getBreadcrumbPath(items, currentPath[currentPath.length - 1]);
    const current = findItemById(items, currentPath[currentPath.length - 1]);
    return current ? [...ancestors, current] : ancestors;
  }, [items, currentPath]);

  const { handleKeyDown: handleAccordionKeyDown } = useKeyboardNavigation(
    menuRef,
    items,
    itemVisibility,
    openSubMenus,
    searchTerm,
    highlightedIndex,
    dispatch
  );

  const showingFavourites = favouritesEnabled && activeTab === "favourites" && favourites.isEligibleForTab;

  // Mirrors exactly what DrilldownMenuList renders (search-filtered, then visibility-filtered), so
  // arrow-key highlighting and numbered shortcuts always target the same item a user sees on screen.
  const searchFilteredCurrentLevelItems = useMemo(
    () => getFilteredItems(currentLevelItems, searchTerm, alwaysShowUnsearchableItems),
    [currentLevelItems, searchTerm, alwaysShowUnsearchableItems]
  );

  const drilldownVisibleItems = useMemo(
    () => searchFilteredCurrentLevelItems.filter((item) => itemVisibility[item.id] === "VISIBLE"),
    [searchFilteredCurrentLevelItems, itemVisibility]
  );

  // If a section in the current path disappears (removed, or hidden by visibilityControl), fall back
  // to the nearest level that still exists rather than showing a dead panel.
  useEffect(() => {
    if (navigationStyle !== "drilldown" || currentPath.length === 0) return;
    const valid = getValidPathPrefix(items, currentPath, itemVisibility);
    if (valid.length < currentPath.length) {
      dispatch({ type: "SET_PATH", payload: valid });
    }
  }, [navigationStyle, items, currentPath, itemVisibility]);

  // After restoring a remembered position, highlight the item that was last activated, once it's
  // actually on screen (its visibility may still be resolving). Abandoned if the user moves first.
  const pendingHighlightRef = useRef<{ path: string; itemId: string } | null>(null);
  useEffect(() => {
    const pending = pendingHighlightRef.current;
    if (!pending) return;
    if (pending.path !== currentPath.join("/") || searchTerm) {
      pendingHighlightRef.current = null;
      return;
    }
    const index = drilldownVisibleItems.findIndex((item) => item.id === pending.itemId);
    if (index > -1) {
      dispatch({ type: "SET_HIGHLIGHTED_INDEX", payload: index });
      pendingHighlightRef.current = null;
    }
  }, [drilldownVisibleItems, currentPath, searchTerm]);

  const { handleKeyDown: handleDrilldownKeyDown } = useDrilldownKeyboardNavigation(
    menuRef,
    showingFavourites ? favourites.favouriteItems : searchFilteredCurrentLevelItems,
    showingFavourites
      ? Object.fromEntries(favourites.favouriteItems.map((i) => [i.id, "VISIBLE" as const]))
      : itemVisibility,
    searchTerm,
    highlightedIndex,
    currentPath.length > 0,
    handleActivateItem,
    dispatch
  );

  const handleKeyDown = navigationStyle === "accordion" ? handleAccordionKeyDown : handleDrilldownKeyDown;

  const numberedShortcutEligibleItems = showingFavourites
    ? favourites.favouriteItems.filter((i) => favourites.isPinned(i.id))
    : drilldownVisibleItems.filter((i) => !i.children);

  const { showBadges: showNumberBadges } = useNumberedShortcuts({
    enabled: navigationStyle === "drilldown" && numberedShortcutsEnabled,
    menuRef,
    eligibleItems: numberedShortcutEligibleItems,
    onActivate: handleActivateItem,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    dispatch({ type: 'SET_SEARCH_TERM', payload: newSearchTerm });
    dispatch({ type: 'SET_HIGHLIGHTED_INDEX', payload: -1 });

    if (navigationStyle !== "accordion") {
      // Search always covers the whole menu, even from inside a section, so a user reopened deep
      // in the tree is never stuck searching just that branch. Clearing the search returns them.
      if (newSearchTerm && !searchTerm && currentPath.length > 0) {
        preSearchPathRef.current = currentPath;
        dispatch({ type: "SET_PATH", payload: [] });
      }
      return;
    }

    const openSubMenusUpdate: { [key: string]: boolean } = {};
    if (newSearchTerm) {
      const searchTokens = newSearchTerm.toLowerCase().split(" ").filter(Boolean);

      const findMatchingParents = (currentItems: typeof items): boolean => {
        let hasMatchingChild = false;
        for (const item of currentItems) {
          const itemText = extractTextFromReactNode(item.label).toLowerCase();
          const directMatch = searchTokens.some(
            (token) =>
              (item.searchTerms || "")
                .toLowerCase()
                .split(" ")
                .some((t) => t.includes(token)) || itemText.includes(token)
          );

          if (item.children) {
            const childrenMatch = findMatchingParents(item.children);
            if (childrenMatch || directMatch) {
              openSubMenusUpdate[item.id] = true;
              hasMatchingChild = true;
            }
          } else if (directMatch) {
            hasMatchingChild = true;
          }
        }
        return hasMatchingChild;
      };

      findMatchingParents(items);
    }
    dispatch({ type: 'SET_OPEN_SUBMENUS', payload: openSubMenusUpdate });
  };

  useEffect(() => {
    if (isOpen && searchAutoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchAutoFocus]);

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768 && openOnDesktop;
  const actualIsOpen = isOpen || isDesktop;

  // Reopen in the section holding the item last activated from the menu.
  useEffect(() => {
    if (!actualIsOpen || !rememberPosition || navigationStyle !== "drilldown") return;
    const stored = readLastPosition(storageNamespace);
    if (!stored) return;
    const path = getValidPathPrefix(items, stored.path, itemVisibility, true);
    dispatch({ type: "SET_PATH", payload: path });
    pendingHighlightRef.current = { path: path.join("/"), itemId: stored.itemId };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualIsOpen]);

  // Return to the pre-search section once the search is cleared (unless the user drilled
  // somewhere else from the search results).
  const preSearchPathRef = useRef<string[] | null>(null);
  useEffect(() => {
    if (!actualIsOpen) {
      preSearchPathRef.current = null;
      return;
    }
    if (searchTerm || !preSearchPathRef.current) return;
    if (currentPath.length === 0) {
      dispatch({ type: "SET_PATH", payload: preSearchPathRef.current });
    }
    preSearchPathRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, actualIsOpen]);

  // Lock body scroll while the mobile overlay is open, so the page behind the scrim can't be
  // scrolled underneath it. Not needed in desktop push mode, where the panel is part of the
  // layout rather than an overlay covering content.
  useEffect(() => {
    if (typeof document === "undefined" || !isOpen || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isDesktop]);

  const toggleMenu = () => {
    // Closing goes through CLOSE_MENU like every other close path (scrim, Escape, activation), so
    // the next open always starts from the remembered position (or the top), never a stale one.
    if (isOpen) {
      closeMenu();
      return;
    }
    dispatch({ type: "SET_IS_OPEN", payload: true });
    dispatch({ type: "SET_HIGHLIGHTED_INDEX", payload: -1 });
  };

  // Click-outside-to-close: only while the menu was opened via toggle (not a persistently-open desktop panel).
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const [persistedRailCollapsed, setPersistedRailCollapsed] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(getStorageKey("railState", storageNamespace));
      if (stored !== null) {
        setPersistedRailCollapsed(stored === "true");
      }
    } catch {
      // ignore read errors, fall back to default (expanded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveRailCollapsed = persistedRailCollapsed ?? railCollapsed;

  const toggleRail = () => {
    dispatch({ type: "TOGGLE_RAIL" });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(getStorageKey("railState", storageNamespace), String(!effectiveRailCollapsed));
      } catch {
        // ignore write errors
      }
    }
    setPersistedRailCollapsed(!effectiveRailCollapsed);
  };

  const { swipeHandlers, dragOffset } = useSwipeGesture({
    enabled: swipeEnabled,
    isOpen: actualIsOpen,
    side: effectiveSide === "right" ? "right" : "left",
    onOpen: () => dispatch({ type: "SET_IS_OPEN", payload: true }),
    onClose: closeMenu,
  });

  const contextValue = {
    state,
    dispatch,
    items,
    closeMenu,
    toggleSubMenu: (id: string) => dispatch({ type: 'TOGGLE_SUBMENU', payload: id }),
    setHighlightedIndex: (index: number) => dispatch({ type: 'SET_HIGHLIGHTED_INDEX', payload: index }),
    searchIcon,
    chevronIcon,
    alwaysShowUnsearchableItems,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <div
        ref={menuRef}
        className={`${styles.container} ${actualIsOpen ? styles.open : ""} ${
          isDesktop ? styles.desktopOpen : ""
        } ${effectiveSide === "right" ? styles.right : ""} ${
          isDesktop && effectiveRailCollapsed ? styles.railCollapsed : ""
        }`}
        onKeyDown={handleKeyDown}
        data-theme={effectiveTheme}
        data-motion={motionIntensity}
        data-surface={surface}
      >
        {isOpen && !isDesktop && <div className={styles.scrim} onClick={closeMenu} />}

        <button
          className={`${styles.hamburger} ${actualIsOpen ? styles.open : ""}`}
          onClick={toggleMenu}
          aria-expanded={actualIsOpen}
          aria-controls="sidekick-menu-panel"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="sidekick-menu-panel"
          className={`${styles.panel} ${actualIsOpen ? styles.open : ""}`}
          style={dragOffset ? { transform: `translateX(${dragOffset}px)` } : undefined}
          {...swipeHandlers}
        >
          {railCollapsible && isDesktop && (
            <button
              type="button"
              className={styles.railToggle}
              onClick={toggleRail}
              aria-pressed={effectiveRailCollapsed}
              aria-label={effectiveRailCollapsed ? "Expand menu" : "Collapse menu"}
            >
              {effectiveRailCollapsed ? "»" : "«"}
            </button>
          )}
          {headerContent && !effectiveRailCollapsed && (
            <div className={styles.headerSection}>{headerContent}</div>
          )}
          {searchEnabled && !effectiveRailCollapsed && (
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={styles.searchInput}
                />
                <span className={styles.searchIcon}>{searchIcon ?? "🔍"}</span>
              </div>
            </div>
          )}

          {navigationStyle === "accordion" ? (
            <MenuList items={items} level={0} parentIsOpened={actualIsOpen} startIndex={0} />
          ) : (
            <>
              {favouritesEnabled && favourites.isEligibleForTab && !effectiveRailCollapsed && (
                <TabSwitcher
                  activeTab={activeTab}
                  onChange={changeTab}
                />
              )}
              {!showingFavourites && (
                <MenuBreadcrumb
                  path={breadcrumbPath}
                  onNavigate={(index) => dispatch({ type: "DRILL_TO_INDEX", payload: index })}
                  onBack={() => dispatch({ type: "DRILL_BACK" })}
                />
              )}
              {showingFavourites ? (
                <FavouritesList
                  favouriteItems={favourites.favouriteItems}
                  allItems={items}
                  highlightedIndex={highlightedIndex}
                  onActivate={handleActivateItem}
                  isPinned={favourites.isPinned}
                  onTogglePin={handleTogglePin}
                  showNumberBadges={showNumberBadges}
                />
              ) : (
                <DrilldownMenuList
                  items={searchFilteredCurrentLevelItems}
                  itemVisibility={itemVisibility}
                  searchTerm={searchTerm}
                  alwaysShowUnsearchableItems={alwaysShowUnsearchableItems}
                  highlightedIndex={highlightedIndex}
                  chevronIcon={chevronIcon}
                  onDrillIn={handleDrillIn}
                  onActivate={handleActivateItem}
                  showNumberBadges={showNumberBadges}
                  isPinned={favouritesEnabled ? favourites.isPinned : undefined}
                  onTogglePin={favouritesEnabled ? handleTogglePin : undefined}
                />
              )}
            </>
          )}

          {footerContent && !effectiveRailCollapsed && (
            <div className={styles.footerSection}>{footerContent}</div>
          )}
        </nav>
      </div>
    </MenuContext.Provider>
  );
};

export default SidekickMenu;
