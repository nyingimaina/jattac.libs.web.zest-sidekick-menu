import { ISidekickMenuItem } from "../types";
import { extractTextFromReactNode } from "../../../utils/reactNodeUtils"; // One level up from UI/SidekickMenu/utils

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

export const getFilteredItems = (
  itemsToFilter: ISidekickMenuItem[],
  currentSearchTerm: string,
  alwaysShowUnsearchableItems: boolean,
  itemVisibility: ItemVisibilityMap
): ISidekickMenuItem[] => {
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
