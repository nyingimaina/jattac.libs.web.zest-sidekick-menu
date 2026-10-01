import { ISidekickMenuItem } from "../types";
import { getStorageKey } from "./namespace";
import { getBreadcrumbPath } from "./breadcrumb";

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

export interface LastPosition {
  /** Ids of the sections (from the root) containing the last activated item. */
  path: string[];
  /** The item that was activated, highlighted again on reopen. */
  itemId: string;
  /** Location key (see `locationKey`) of the page the user ended up on, so a later open can tell
   * whether they've since moved to another page by some other route (link, bookmark, back button). */
  url?: string;
}

const stripTrailingSlash = (pathname: string) =>
  pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

/** Pathname plus hash route (when it looks like one, e.g. "#/settings"), ignoring query string. */
export const locationKey = (href: string, base?: string): string | null => {
  try {
    const url = new URL(href, base ?? (typeof window !== "undefined" ? window.location.href : undefined));
    if (typeof window !== "undefined" && url.origin !== window.location.origin) return null;
    const hashRoute = url.hash.startsWith("#/") ? stripTrailingSlash(url.hash) : "";
    return stripTrailingSlash(url.pathname) + hashRoute;
  } catch {
    return null;
  }
};

/**
 * Finds the leaf item whose `path` best matches the given location key: an exact match wins,
 * otherwise the longest item path that is a whole-segment prefix of it (so "/orders/42" matches
 * an "/orders" item, but "/ordersx" does not). "/" only ever matches exactly. Hidden items, and
 * items inside hidden sections, are skipped.
 */
export const findItemForLocation = (
  items: ISidekickMenuItem[],
  currentKey: string,
  itemVisibility: ItemVisibilityMap
): ISidekickMenuItem | null => {
  let best: { item: ISidekickMenuItem; score: number } | null = null;
  const walk = (level: ISidekickMenuItem[]) => {
    for (const item of level) {
      if (itemVisibility[item.id] === "HIDDEN") continue;
      if (item.children) {
        walk(item.children);
        continue;
      }
      if (!item.path) continue;
      const key = locationKey(item.path);
      if (!key) continue;
      let score = 0;
      if (key === currentKey) score = key.length * 2 + 1;
      else if (key !== "/" && currentKey.startsWith(key + "/")) score = key.length;
      if (score > 0 && (!best || score > best.score)) best = { item, score };
    }
  };
  walk(items);
  return best ? (best as { item: ISidekickMenuItem }).item : null;
};

/**
 * Decides where the menu should open. The stored position wins while the user is still on the
 * page they reached through it; once they've moved (via a link, bookmark, back button or router
 * call), the item matching the current URL wins; failing that, the stored position is the best guess.
 */
export const resolveOpenPosition = (
  items: ISidekickMenuItem[],
  stored: LastPosition | null,
  currentKey: string | null,
  itemVisibility: ItemVisibilityMap
): { path: string[]; itemId: string } | null => {
  if (stored && (!currentKey || !stored.url || stored.url === currentKey)) return stored;
  const match = currentKey ? findItemForLocation(items, currentKey, itemVisibility) : null;
  if (match) return { path: getBreadcrumbPath(items, match.id).map((i) => i.id), itemId: match.id };
  return stored;
};

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
  item: ISidekickMenuItem,
  storageNamespace?: string
): void => {
  if (typeof window === "undefined") return;
  // A path item is about to navigate there; an onClick item leaves the user on the current page.
  const url = locationKey(item.path ?? window.location.href) ?? undefined;
  const position: LastPosition = { path: getBreadcrumbPath(items, item.id).map((i) => i.id), itemId: item.id, url };
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
