import { useCallback, useEffect, Dispatch } from "react";
import { ISidekickMenuItem } from "../types";
import { MenuAction } from "../context/MenuContext";

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

export const useKeyboardNavigation = (
  menuRef: React.RefObject<HTMLElement>,
  items: ISidekickMenuItem[],
  itemVisibility: ItemVisibilityMap,
  openSubMenus: { [key: string]: boolean },
  searchTerm: string,
  highlightedIndex: number,
  dispatch: Dispatch<MenuAction>
) => {
  const getFlattenedVisibleItems = useCallback(
    (
      currentItems: ISidekickMenuItem[],
      acc: ISidekickMenuItem[] = []
    ): ISidekickMenuItem[] => {
      for (const item of currentItems) {
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
    scrollHighlightedItemIntoView();
  }, [highlightedIndex, scrollHighlightedItemIntoView]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const flattenedVisibleItems = getFlattenedVisibleItems(items);

      if (event.key === "ArrowUp") {
        event.preventDefault();
        dispatch({ type: 'SET_HIGHLIGHTED_INDEX', payload: Math.max(highlightedIndex - 1, 0) });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        dispatch({
          type: 'SET_HIGHLIGHTED_INDEX',
          payload: Math.min(highlightedIndex + 1, flattenedVisibleItems.length - 1),
        });
      } else if (event.key === "Enter" && highlightedIndex > -1) {
        const item = flattenedVisibleItems[highlightedIndex];
        if (item) {
          if (item.children) {
            dispatch({ type: 'TOGGLE_SUBMENU', payload: item.id });
          } else {
            if (item.path) {
              window.location.href = item.path;
            } else if (item.onClick) {
              item.onClick();
            }
            dispatch({ type: 'CLOSE_MENU' });
          }
        }
      } else if (event.key === "Escape") {
        if (searchTerm) {
          dispatch({ type: 'SET_SEARCH_TERM', payload: '' });
          dispatch({ type: 'SET_HIGHLIGHTED_INDEX', payload: -1 });
        } else {
          dispatch({ type: 'CLOSE_MENU' });
        }
      }
    },
    [highlightedIndex, items, itemVisibility, openSubMenus, searchTerm, dispatch, getFlattenedVisibleItems]
  );

  return { handleKeyDown };
};
