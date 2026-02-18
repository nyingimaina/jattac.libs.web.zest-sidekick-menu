import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../Styles/SidekickMenu.module.css";
import { SidekickMenuProps, ISidekickMenuItem } from "./types";
import { extractTextFromReactNode } from "../../utils/reactNodeUtils";

// Hooks
import { useItemVisibility } from "./hooks/useItemVisibility";
import { useFocusTrap } from "./hooks/useFocusTrap";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

// Utils
import { validateItemIds } from "./utils/validation";

// Components
import MenuList from "./components/MenuList";

const SidekickMenu: React.FC<SidekickMenuProps> = ({
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Validate item IDs in development
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      validateItemIds(items);
    }
  }, [items]);

  // Handle item visibility
  const itemVisibility = useItemVisibility(items, cacheLifetime);

  // Handle focus trap
  useFocusTrap(menuRef, isOpen);

  // Handle keyboard navigation
  const toggleSubMenu = (id: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const closeMenu = () => {
    setIsOpen(false);
    setSearchTerm(""); // Reset search term when menu closes
    setHighlightedIndex(-1); // Reset highlight when menu closes
  };

  const { highlightedIndex, setHighlightedIndex, handleKeyDown } = useKeyboardNavigation(
    menuRef,
    items, // Pass raw items to navigation for flattening and finding
    itemVisibility,
    openSubMenus,
    toggleSubMenu,
    searchTerm,
    setSearchTerm,
    closeMenu
  );

  // Auto focus search input when menu opens
  useEffect(() => {
    if (isOpen && searchAutoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchAutoFocus]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    setHighlightedIndex(-1); // Reset highlight when menu is toggled
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setHighlightedIndex(-1); // Reset highlight on search change

    // Auto-open parent sub-menus if children match search
    const idsToOpen: string[] = [];
    const searchTokens = newSearchTerm.toLowerCase().split(" ").filter(Boolean);

    if (newSearchTerm) {
      const collectParentIds = (currentItems: ISidekickMenuItem[]) => {
        currentItems.forEach((item) => {
          const itemText = extractTextFromReactNode(item.label).toLowerCase();
          const directMatch = searchTokens.some(
            (token) =>
              item.searchTerms
                .toLowerCase()
                .split(" ")
                .some((t) => t.includes(token)) || itemText.includes(token)
          );

          if (item.children) {
            const childrenMatchResult = collectParentIds(item.children); // Recursive call
            if (childrenMatchResult.length > 0 || directMatch) {
              idsToOpen.push(item.id);
            }
          } else if (directMatch) {
            idsToOpen.push(item.id);
          }
        });
        return idsToOpen; // Return collected IDs
      };
      collectParentIds(items);
    }

    setOpenSubMenus(
      newSearchTerm === ""
        ? {}
        : idsToOpen.reduce((acc, id) => ({ ...acc, [id]: true }), {})
    );
  };

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768 && openOnDesktop;
  const actualIsOpen = isOpen || isDesktop;

  return (
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
        <MenuList
          items={items}
          level={0}
          itemVisibility={itemVisibility}
          openSubMenus={openSubMenus}
          toggleSubMenu={toggleSubMenu}
          currentSearchTerm={searchTerm}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          chevronIcon={chevronIcon}
          closeMenu={closeMenu}
          alwaysShowUnsearchableItems={alwaysShowUnsearchableItems}
          parentIsOpened={actualIsOpen} // Pass actualIsOpen for the top-level MenuList
        />
        {footerContent && (
          <div className={styles.footerSection}>{footerContent}</div>
        )}
      </nav>
    </div>
  );
};

export default SidekickMenu;
