import { useState, useCallback, useEffect } from "react";
import { ISidekickMenuItem } from "../types";

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

export const useKeyboardNavigation = (
  menuRef: React.RefObject<HTMLElement>,
  items: ISidekickMenuItem[],
  itemVisibility: ItemVisibilityMap,
  openSubMenus: { [key: string]: boolean },
  toggleSubMenu: (id: string) => void,
  searchTerm: string,
  setSearchTerm: (term: string) => void,
  closeMenu: () => void
) => {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Helper function to get all currently visible (not hidden or pending) items in a flat list
  // This is used for keyboard navigation to properly step through visible items.
  const getFlattenedVisibleItems = useCallback(
    (
      currentItems: ISidekickMenuItem[],
      acc: ISidekickMenuItem[] = []
    ): ISidekickMenuItem[] => {
      for (const item of currentItems) {
        // Only consider items that are explicitly VISIBLE for keyboard navigation
        // PENDING items are represented by skeletons and are not navigable in this context
        if (itemVisibility[item.id] === "VISIBLE") {
          acc.push(item);
          if (item.children && openSubMenus[item.id]) {
            getFlattenedVisibleItems(item.children, acc);
          }
        }
      }
      return acc;
    },
    [itemVisibility, openSubMenus]
  );

  const scrollHighlightedItemIntoView = useCallback(() => {
    const highlightedItem = menuRef.current?.querySelector(
      `[data-highlighted="true"]`
    );
    if (highlightedItem) {
      highlightedItem.scrollIntoView({ block: "nearest" });
    }
  }, [menuRef]);

  useEffect(() => {
    // Scroll into view whenever the highlighted index changes
    scrollHighlightedItemIntoView();
  }, [highlightedIndex, scrollHighlightedItemIntoView]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const flattenedVisibleItems = getFlattenedVisibleItems(items);

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, flattenedVisibleItems.length - 1)
        );
      } else if (event.key === "Enter" && highlightedIndex > -1) {
        const item = flattenedVisibleItems[highlightedIndex];
        if (item) {
          if (item.children) {
            toggleSubMenu(item.id);
          } else if (item.path) {
            window.location.href = item.path;
            closeMenu();
          } else if (item.onClick) {
            item.onClick();
            closeMenu();
          }
        }
      } else if (event.key === "Escape") {
        if (searchTerm) {
          setSearchTerm("");
          setHighlightedIndex(-1);
        } else {
          closeMenu();
        }
      }
    },
    [
      highlightedIndex,
      items,
      itemVisibility, // Dependency for getFlattenedVisibleItems
      openSubMenus, // Dependency for getFlattenedVisibleItems
      toggleSubMenu,
      searchTerm,
      setSearchTerm,
      closeMenu,
      getFlattenedVisibleItems,
    ]
  );

  return { highlightedIndex, setHighlightedIndex, handleKeyDown };
};
