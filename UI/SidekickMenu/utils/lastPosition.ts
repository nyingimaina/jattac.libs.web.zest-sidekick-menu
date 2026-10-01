import { ISidekickMenuItem } from "../types";
import { getStorageKey } from "./namespace";
import { getBreadcrumbPath } from "./breadcrumb";

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

export interface LastPosition {
  /** Ids of the sections (from the root) containing the last activated item. */
  path: string[];
  /** The item that was activated, highlighted again on reopen. */
  itemId: string;
}

// sessionStorage, not localStorage: within one working session reopening where you were is
// helpful, but a fresh visit should start from the top of the menu.
export const readLastPosition = (storageNamespace?: string): LastPosition | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(getStorageKey("lastPosition", storageNamespace));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Array.isArray(parsed.path) &&
      parsed.path.every((id: unknown) => typeof id === "string") &&
      typeof parsed.itemId === "string"
    ) {
      return parsed;
    }
  } catch {
    // ignore read/parse errors
  }
  return null;
};

export const writeLastPosition = (
  items: ISidekickMenuItem[],
  itemId: string,
  storageNamespace?: string
): void => {
  if (typeof window === "undefined") return;
  const position: LastPosition = { path: getBreadcrumbPath(items, itemId).map((i) => i.id), itemId };
  try {
    sessionStorage.setItem(getStorageKey("lastPosition", storageNamespace), JSON.stringify(position));
  } catch {
    // ignore write errors
  }
};

/**
 * Returns the longest prefix of `path` that is still navigable: every id must exist as a child of
 * the previous section, have children, and not be hidden. Items get removed or permissioned away
 * between visits, so a path must never leave the user on a missing section. With `requireNonEmpty`
 * (used when restoring a stored path) sections with no visible children are also rejected, so a
 * restore never opens onto an empty panel.
 */
export const getValidPathPrefix = (
  items: ISidekickMenuItem[],
  path: string[],
  itemVisibility: ItemVisibilityMap,
  requireNonEmpty = false
): string[] => {
  const valid: string[] = [];
  let level = items;
  for (const id of path) {
    const item = level.find((i) => i.id === id);
    if (!item || !item.children || itemVisibility[id] === "HIDDEN") break;
    if (requireNonEmpty && item.children.every((child) => itemVisibility[child.id] === "HIDDEN")) break;
    valid.push(id);
    level = item.children;
  }
  return valid;
};
