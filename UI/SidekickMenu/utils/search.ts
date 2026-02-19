import { ISidekickMenuItem } from "../types";
import { extractTextFromReactNode } from "../../../utils/reactNodeUtils"; // One level up from UI/SidekickMenu/utils

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

export const getFilteredItems = (
  itemsToFilter: ISidekickMenuItem[],
  currentSearchTerm: string,
  alwaysShowUnsearchableItems: boolean,
  itemVisibility: ItemVisibilityMap // Keep for signature consistency, though not used for filtering here.
): ISidekickMenuItem[] => {

  if (!currentSearchTerm) {
    // If no search term, return all items. Visibility will be handled by MenuItem.
    return itemsToFilter;
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
            isVisible: item.isVisible,
            isCachable: item.isCachable,
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

  // Now filterRecursive operates on the original itemsToFilter
  return filterRecursive(itemsToFilter);
};
