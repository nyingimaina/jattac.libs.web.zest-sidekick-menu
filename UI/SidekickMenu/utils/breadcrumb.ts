import { ISidekickMenuItem } from "../types";

export const findItemById = (
  items: ISidekickMenuItem[],
  id: string
): ISidekickMenuItem | undefined => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

export const getBreadcrumbPath = (
  items: ISidekickMenuItem[],
  targetId: string
): ISidekickMenuItem[] => {
  const walk = (
    currentItems: ISidekickMenuItem[],
    ancestors: ISidekickMenuItem[]
  ): ISidekickMenuItem[] | null => {
    for (const item of currentItems) {
      if (item.id === targetId) return ancestors;
      if (item.children) {
        const result = walk(item.children, [...ancestors, item]);
        if (result) return result;
      }
    }
    return null;
  };

  return walk(items, []) ?? [];
};
