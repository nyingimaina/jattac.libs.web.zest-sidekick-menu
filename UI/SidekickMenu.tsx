import React, { Component, createRef } from "react";
import styles from "../Styles/SidekickMenu.module.css";
import {
  extractTextFromReactNode,
  highlightReactNode,
} from "../utils/reactNodeUtils";

const CACHE_KEY = "sidekickMenuVisibilityCache";

export const clearSidekickMenuCache = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error("Error clearing SidekickMenu cache:", error);
    }
  }
};

const MenuItemSkeleton = ({ level }: { level: number }) => (
  <li
    className={`${styles.menuItem} ${styles.menuItemSkeleton}`}
    style={{ paddingLeft: `${20 + level * 20}px` }}
  >
    <span className={`${styles.itemIcon} ${styles.skeleton}`} />
    <span className={`${styles.itemLabel} ${styles.skeleton}`} />
  </li>
);

export type ISidekickMenuItem = {
  id: string;
  label: React.ReactNode;
  icon: React.ReactNode;
  searchTerms: string;
  visibilityControl?: {
    isVisibleResolver?: () => boolean | Promise<boolean>;
    isCachable?: boolean;
  };
} & (
  | { path: string; onClick?: never; children?: never }
  | { path?: never; onClick: () => void; children?: never }
  | { path?: never; onClick?: never; children: ISidekickMenuItem[] }
);

export interface SidekickMenuProps {
  items: ISidekickMenuItem[];
  searchEnabled?: boolean;
  searchAutoFocus?: boolean;
  searchPlaceholder?: string;
  alwaysShowUnsearchableItems?: boolean;
  openOnDesktop?: boolean;
  searchIcon?: React.ReactNode;
  chevronIcon?: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  cacheLifetime?: number;
}

interface SidekickMenuState {
  isOpen: boolean;
  searchTerm: string;
  highlightedIndex: number;
  openSubMenus: { [key: string]: boolean };
  itemVisibility: { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };
}

class SidekickMenu extends Component<SidekickMenuProps, SidekickMenuState> {
  static defaultProps = {
    searchEnabled: true,
    searchAutoFocus: true,
    searchPlaceholder: "Search menu...",
    alwaysShowUnsearchableItems: true,
    openOnDesktop: false,
    cacheLifetime: 24,
  };

  state: SidekickMenuState = {
    isOpen: false,
    searchTerm: "",
    highlightedIndex: -1,
    openSubMenus: {},
    itemVisibility: {},
  };

  private searchInputRef = createRef<HTMLInputElement>();
  private menuRef = createRef<HTMLDivElement>();
  private lastFocusedElement: HTMLElement | null = null;

  componentDidMount() {
    if (process.env.NODE_ENV !== "production") {
      this._validateItemIds(this.props.items);
    }
    this._processItemVisibilities();
  }

  componentDidUpdate(
    prevProps: SidekickMenuProps,
    prevState: SidekickMenuState
  ) {
    if (prevProps.items !== this.props.items) {
      if (process.env.NODE_ENV !== "production") {
        this._validateItemIds(this.props.items);
      }
      this._processItemVisibilities();
    }

    if (this.state.isOpen && !prevState.isOpen) {
      this.lastFocusedElement = document.activeElement as HTMLElement;
      if (this.props.searchAutoFocus && this.searchInputRef.current) {
        this.searchInputRef.current.focus();
      }
      document.addEventListener("keydown", this.handleFocusTrap);
    } else if (!this.state.isOpen && prevState.isOpen) {
      document.removeEventListener("keydown", this.handleFocusTrap);
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }
    }

    if (this.state.highlightedIndex !== prevState.highlightedIndex) {
      this.scrollHighlightedItemIntoView();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleFocusTrap);
  }

  _validateItemIds = (items: ISidekickMenuItem[]) => {
    const ids = new Set<string>();
    const traverse = (itemsToTraverse: ISidekickMenuItem[]) => {
      itemsToTraverse.forEach((item) => {
        if (!item.id) {
          console.error(
            "[SidekickMenu] Error: Found a menu item without a required 'id' prop.",
            item
          );
          throw new Error(
            "SidekickMenu: All menu items must have a unique 'id' prop."
          );
        }
        if (ids.has(item.id)) {
          console.error(
            `[SidekickMenu] Error: Found a duplicate menu item id: '${item.id}'.`,
            item
          );
          throw new Error(
            `SidekickMenu: Duplicate menu item id '${item.id}' found. IDs must be unique.`
          );
        }
        ids.add(item.id);
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(items);
  };

  _processItemVisibilities = () => {
    const { items, cacheLifetime } = this.props;
    const now = new Date().getTime();
    let cache = {};
    if (typeof window !== "undefined") {
      try {
        cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      } catch (error) {
        console.error("Error reading SidekickMenu cache:", error);
        cache = {};
      }
    }

    const initialVisibilityState: {
      [key: string]: "VISIBLE" | "HIDDEN" | "PENDING";
    } = {};
    const itemsToResolve: ISidekickMenuItem[] = [];

    const processItems = (itemsToProcess: ISidekickMenuItem[]) => {
      itemsToProcess.forEach((item) => {
        if (item.visibilityControl?.isVisibleResolver) {
          const cachedItem = cache[item.id];
          if (cachedItem && cachedItem.expires > now) {
            initialVisibilityState[item.id] = cachedItem.visible
              ? "VISIBLE"
              : "HIDDEN";
          } else {
            initialVisibilityState[item.id] = "PENDING";
            itemsToResolve.push(item);
          }
        } else {
          initialVisibilityState[item.id] = "VISIBLE";
        }

        if (item.children) {
          processItems(item.children);
        }
      });
    };

    processItems(items);
    this.setState({ itemVisibility: initialVisibilityState });

    itemsToResolve.forEach(async (item) => {
      const isVisible = await item.visibilityControl!.isVisibleResolver!();
      this.setState((prevState) => ({
        itemVisibility: {
          ...prevState.itemVisibility,
          [item.id]: isVisible ? "VISIBLE" : "HIDDEN",
        },
      }));

      if (item.visibilityControl?.isCachable && typeof window !== "undefined") {
        const newCache = { ...cache };
        newCache[item.id] = {
          visible: isVisible,
          expires: now + (cacheLifetime ?? 24) * 60 * 60 * 1000,
        };
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
        } catch (error) {
          console.error("Error writing SidekickMenu cache:", error);
        }
      }
    });
  };

  toggleMenu = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
      highlightedIndex: -1,
    }));
  };

  toggleSubMenu = (id: string) => {
    this.setState((prevState) => ({
      openSubMenus: {
        ...prevState.openSubMenus,
        [id]: !prevState.openSubMenus[id],
      },
    }));
  };

  handleFocusTrap = (event: KeyboardEvent) => {
    if (event.key !== "Tab" || !this.menuRef.current) return;

    const focusableElements = this.menuRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  };

  scrollHighlightedItemIntoView = () => {
    const highlightedItem = this.menuRef.current?.querySelector(
      `.${styles.highlighted}`
    );
    if (highlightedItem) {
      highlightedItem.scrollIntoView({ block: "nearest" });
    }
  };

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    const searchTokens = newSearchTerm.toLowerCase().split(" ").filter(Boolean);
    const idsToOpen: string[] = [];

    const collectParentIds = (items: ISidekickMenuItem[]) => {
      items.forEach((item) => {
        const itemText = extractTextFromReactNode(item.label).toLowerCase();
        const directMatch = searchTokens.some(
          (token) =>
            item.searchTerms
              .toLowerCase()
              .split(" ")
              .some((t) => t.includes(token)) || itemText.includes(token)
        );

        if (item.children) {
          const childrenMatch = collectParentIds(item.children);
          if (childrenMatch || directMatch) {
            idsToOpen.push(item.id);
          }
        } else if (directMatch) {
          idsToOpen.push(item.id);
        }
      });
      return idsToOpen.length > 0;
    };

    collectParentIds(this.props.items);

    this.setState((prevState) => ({
      searchTerm: newSearchTerm,
      highlightedIndex: -1,
      openSubMenus:
        newSearchTerm === ""
          ? {}
          : {
              ...prevState.openSubMenus,
              ...idsToOpen.reduce((acc, id) => ({ ...acc, [id]: true }), {}),
            },
    }));
  };

  handleKeyDown = (event: React.KeyboardEvent) => {
    const visibleItems = this.getVisibleItems();
    const { highlightedIndex } = this.state;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.setState((prevState) => ({
        highlightedIndex: Math.max(prevState.highlightedIndex - 1, 0),
      }));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      this.setState((prevState) => ({
        highlightedIndex: Math.min(
          prevState.highlightedIndex + 1,
          visibleItems.length - 1
        ),
      }));
    } else if (event.key === "Enter" && highlightedIndex > -1) {
      const item = visibleItems[highlightedIndex];
      if (item.children) {
        this.toggleSubMenu(item.id);
      } else if (item.path) {
        window.location.href = item.path;
        this.toggleMenu();
      } else if (item.onClick) {
        item.onClick();
        this.toggleMenu();
      }
    } else if (event.key === "Escape") {
      if (this.state.searchTerm) {
        this.setState({ searchTerm: "", highlightedIndex: -1 });
      } else {
        this.toggleMenu();
      }
    }
  };

  getVisibleItems = (
    items: ISidekickMenuItem[] = this.props.items
  ): ISidekickMenuItem[] => {
    const { openSubMenus, itemVisibility } = this.state;
    const visibleItems: ISidekickMenuItem[] = [];

    for (const item of items) {
      if (itemVisibility[item.id] === "VISIBLE") {
        visibleItems.push(item);
        if (item.children && openSubMenus[item.id]) {
          visibleItems.push(...this.getVisibleItems(item.children));
        }
      }
    }

    return visibleItems;
  };

  getFilteredItems = (
    itemsToFilter: ISidekickMenuItem[],
    currentSearchTerm: string
  ): ISidekickMenuItem[] => {
    const { alwaysShowUnsearchableItems } = this.props;
    const { itemVisibility } = this.state;

    const visibleItems = itemsToFilter.filter(
      (item) => itemVisibility[item.id] === "VISIBLE"
    );

    if (!currentSearchTerm) {
      return visibleItems;
    }

    const searchTokens = currentSearchTerm
      .toLowerCase()
      .split(" ")
      .filter(Boolean);

    const filterRecursive = (
      items: ISidekickMenuItem[]
    ): ISidekickMenuItem[] => {
      return items.reduce<ISidekickMenuItem[]>((acc, item) => {
        const itemText = extractTextFromReactNode(item.label).toLowerCase();
        const directMatch = searchTokens.some(
          (token) =>
            item.searchTerms
              .toLowerCase()
              .split(" ")
              .some((itemTerm) => itemTerm.includes(token)) ||
            itemText.includes(token)
        );

        if (item.children) {
          const matchingChildren = filterRecursive(item.children);
          if (matchingChildren.length > 0) {
            acc.push({
              id: item.id,
              label: item.label,
              icon: item.icon,
              searchTerms: item.searchTerms,
              visibilityControl: item.visibilityControl,
              children: matchingChildren,
            });
          } else if (
            directMatch ||
            (alwaysShowUnsearchableItems && !item.searchTerms)
          ) {
            acc.push(item);
          }
        } else if (
          directMatch ||
          (alwaysShowUnsearchableItems && !item.searchTerms)
        ) {
          acc.push(item);
        }

        return acc;
      }, []);
    };

    return filterRecursive(visibleItems);
  };

  renderMenuItems = (
    items: ISidekickMenuItem[],
    level = 0,
    currentSearchTerm: string
  ): React.ReactNode => {
    const { highlightedIndex, itemVisibility } = this.state;
    const visibleItems = this.getVisibleItems();
    const { chevronIcon } = this.props;

    return items.map((item) => {
      const visibility = itemVisibility[item.id];

      if (visibility === "HIDDEN") {
        return null;
      }

      if (visibility === "PENDING") {
        return <MenuItemSkeleton key={`${item.id}-skeleton`} level={level} />;
      }

      const isSubMenuOpen = this.state.openSubMenus[item.id];
      const currentIndex = visibleItems.findIndex((i) => i.id === item.id);

      return (
        <React.Fragment key={item.id}>
          <li
            className={`${styles.menuItem} ${
              currentIndex === highlightedIndex ? styles.highlighted : ""
            }`}
            style={{ paddingLeft: `${20 + level * 20}px` }}
            onClick={() => {
              if (item.children) {
                this.toggleSubMenu(item.id);
              } else if (item.path) {
                window.location.href = item.path;
                this.toggleMenu();
              } else if (item.onClick) {
                item.onClick();
                this.toggleMenu();
              }
            }}
          >
            <span className={styles.itemIcon}>{item.icon}</span>
            <span className={styles.itemLabel}>
              {highlightReactNode(
                item.label,
                currentSearchTerm,
                styles.highlight
              )}
            </span>
            {item.children && (
              <span
                className={`${styles.chevron} ${
                  isSubMenuOpen ? styles.open : ""
                }`}
              >
                {chevronIcon ?? "▼"}
              </span>
            )}
          </li>
          {item.children && isSubMenuOpen && (
            <ul className={`${styles.subMenu} ${styles.open}`}>
              {this.renderMenuItems(
                item.children,
                level + 1,
                currentSearchTerm
              )}
            </ul>
          )}
        </React.Fragment>
      );
    });
  };

  render() {
    const {
      searchEnabled,
      searchPlaceholder,
      openOnDesktop,
      searchIcon,
      headerContent,
      footerContent,
    } = this.props;
    const { searchTerm } = this.state;

    const filteredItems = this.getFilteredItems(this.props.items, searchTerm);
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768 && openOnDesktop;
    const isOpen = this.state.isOpen || isDesktop;

    return (
      <div
        ref={this.menuRef}
        className={`${styles.container} ${isOpen ? styles.open : ""} ${
          isDesktop ? styles.desktopOpen : ""
        }`}
        onKeyDown={this.handleKeyDown}
      >
        <button
          className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
          onClick={this.toggleMenu}
          aria-expanded={isOpen}
          aria-controls="sidekick-menu-panel"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="sidekick-menu-panel"
          className={`${styles.panel} ${isOpen ? styles.open : ""}`}
        >
          {headerContent && (
            <div className={styles.headerSection}>{headerContent}</div>
          )}
          {searchEnabled && (
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <input
                  ref={this.searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={this.handleSearchChange}
                  className={styles.searchInput}
                />
                <span className={styles.searchIcon}>{searchIcon ?? "🔍"}</span>
              </div>
            </div>
          )}
          <ul className={styles.menuList}>
            {this.renderMenuItems(this.props.items, 0, searchTerm)}
          </ul>
          {footerContent && (
            <div className={styles.footerSection}>{footerContent}</div>
          )}
        </nav>
      </div>
    );
  }
}

export default SidekickMenu;
