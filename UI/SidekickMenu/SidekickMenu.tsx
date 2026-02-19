import React, { useEffect, useReducer, useRef } from "react";
import styles from "../../Styles/SidekickMenu.module.css";
import { SidekickMenuProps } from "./types";
import { extractTextFromReactNode } from "../../utils/reactNodeUtils";

// Context and Reducer
import { MenuContext, menuReducer, MenuState } from "./context/MenuContext";

// Hooks
import { useItemVisibility } from "./hooks/useItemVisibility";
import { useFocusTrap } from "./hooks/useFocusTrap";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

// Utils
import { validateItemIds } from "./utils/validation";

// Components
import MenuList from "./components/MenuList";

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
  } = props;

  const initialState: MenuState = {
    isOpen: false,
    searchTerm: "",
    highlightedIndex: -1,
    openSubMenus: {},
    itemVisibility: {},
  };

  const [state, dispatch] = useReducer(menuReducer, initialState);
  const { isOpen, searchTerm, openSubMenus, highlightedIndex, itemVisibility } = state;

  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      validateItemIds(items);
    }
  }, [items]);

  const visibility = useItemVisibility(items, cacheLifetime);
  useEffect(() => {
    dispatch({ type: "SET_ITEM_VISIBILITY", payload: visibility });
  }, [visibility]);

  useFocusTrap(menuRef, isOpen);

  const { handleKeyDown } = useKeyboardNavigation(
    menuRef,
    items,
    itemVisibility,
    openSubMenus,
    searchTerm,
    highlightedIndex,
    dispatch
  );

  useEffect(() => {
    if (isOpen && searchAutoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchAutoFocus]);

  const toggleMenu = () => {
    dispatch({ type: "SET_IS_OPEN", payload: !isOpen });
    dispatch({ type: "SET_HIGHLIGHTED_INDEX", payload: -1 });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    dispatch({ type: 'SET_SEARCH_TERM', payload: newSearchTerm });
    dispatch({ type: 'SET_HIGHLIGHTED_INDEX', payload: -1 });

    const openSubMenus: { [key: string]: boolean } = {};
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
              openSubMenus[item.id] = true;
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
    dispatch({ type: 'SET_OPEN_SUBMENUS', payload: openSubMenus });
  };

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768 && openOnDesktop;
  const actualIsOpen = isOpen || isDesktop;

  const contextValue = {
    state,
    dispatch,
    items,
    closeMenu: () => dispatch({ type: 'CLOSE_MENU' }),
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
        }`}
        onKeyDown={handleKeyDown}
      >
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
        >
          {headerContent && (
            <div className={styles.headerSection}>{headerContent}</div>
          )}
          {searchEnabled && (
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
          <MenuList items={items} level={0} parentIsOpened={actualIsOpen} />
          {footerContent && (
            <div className={styles.footerSection}>{footerContent}</div>
          )}
        </nav>
      </div>
    </MenuContext.Provider>
  );
};

export default SidekickMenu;
