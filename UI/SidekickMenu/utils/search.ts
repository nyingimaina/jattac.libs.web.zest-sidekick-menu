import { ISidekickMenuItem } from "../types";
import { extractTextFromReactNode } from "../../../utils/reactNodeUtils";

export const getFilteredItems = (
  itemsToFilter: ISidekickMenuItem[],
  currentSearchTerm: string,
  alwaysShowUnsearchableItems: boolean
): ISidekickMenuItem[] => {

  if (!currentSearchTerm) {
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
          (item.searchTerms || "")
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
          (alwaysShowUnsearchableItems && !(item.searchTerms || ""))
        ) {
          acc.push(item);
        }
      } else if (
        directMatch ||
        (alwaysShowUnsearchableItems && !(item.searchTerms || ""))
      ) {
        acc.push(item);
      }

      return acc;
    }, []);
  };

  return filterRecursive(itemsToFilter);
};
