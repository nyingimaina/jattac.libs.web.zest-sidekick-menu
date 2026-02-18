import { ISidekickMenuItem } from "../types";

export const validateItemIds = (items: ISidekickMenuItem[]) => {
  if (process.env.NODE_ENV === "production") return;

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
