import { useCallback, useEffect } from "react";
import { ISidekickMenuItem } from "../types";
import { MenuAction } from "../context/MenuContext";

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

export const useDrilldownKeyboardNavigation = (
  menuRef: React.RefObject<HTMLElement>,
  currentLevelItems: ISidekickMenuItem[],
  itemVisibility: ItemVisibilityMap,
  searchTerm: string,
  highlightedIndex: number,
  canDrillBack: boolean,
  onActivate: (item: ISidekickMenuItem) => void,
  dispatch: React.Dispatch<MenuAction>
) => {
  const visibleItems = currentLevelItems.filter((item) => itemVisibility[item.id] === "VISIBLE");

  const scrollHighlightedItemIntoView = useCallback(() => {
    const highlightedItem = menuRef.current?.querySelector(`[data-highlighted="true"]`);
    if (highlightedItem) {
      highlightedItem.scrollIntoView({ block: "nearest" });
    }
  }, [menuRef]);

  useEffect(() => {
    scrollHighlightedItemIntoView();
  }, [highlightedIndex, scrollHighlightedItemIntoView]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        dispatch({ type: "SET_HIGHLIGHTED_INDEX", payload: Math.max(highlightedIndex - 1, 0) });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        dispatch({
          type: "SET_HIGHLIGHTED_INDEX",
          payload: Math.min(highlightedIndex + 1, visibleItems.length - 1),
        });
      } else if (event.key === "ArrowRight" || event.key === "Enter") {
        const item = highlightedIndex > -1 ? visibleItems[highlightedIndex] : undefined;
        if (item?.children) {
          event.preventDefault();
          dispatch({ type: "DRILL_IN", payload: item.id });
        } else if (item && event.key === "Enter") {
          onActivate(item);
        }
      } else if ((event.key === "ArrowLeft" || event.key === "Backspace") && !searchTerm && canDrillBack) {
        event.preventDefault();
        dispatch({ type: "DRILL_BACK" });
      } else if (event.key === "Escape") {
        if (searchTerm) {
          dispatch({ type: "SET_SEARCH_TERM", payload: "" });
          dispatch({ type: "SET_HIGHLIGHTED_INDEX", payload: -1 });
        } else if (canDrillBack) {
          dispatch({ type: "DRILL_BACK" });
        } else {
          dispatch({ type: "CLOSE_MENU" });
        }
      }
    },
    [highlightedIndex, visibleItems, searchTerm, canDrillBack, onActivate, dispatch]
  );

  return { handleKeyDown };
};
