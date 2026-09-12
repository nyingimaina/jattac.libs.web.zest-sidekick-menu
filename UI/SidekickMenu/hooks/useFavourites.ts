import { useCallback, useMemo, useState } from "react";
import { ISidekickMenuItem, FavouritesOptions } from "../types";
import { findItemById } from "../utils/breadcrumb";
import {
  readUsageStats,
  writeUsageStats,
  recordUsageTimestamp,
  UsageStatsDocument,
} from "../utils/favouritesStorage";

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

export interface UseFavouritesResult {
  favouriteItems: ISidekickMenuItem[];
  isEligibleForTab: boolean;
  recordUsage: (itemId: string) => void;
  pinnedIds: string[];
  pinItem: (id: string) => void;
  unpinItem: (id: string) => void;
  isPinned: (id: string) => boolean;
}

export const useFavourites = (
  items: ISidekickMenuItem[],
  itemVisibility: ItemVisibilityMap,
  options: FavouritesOptions = {},
  storageNamespace?: string
): UseFavouritesResult => {
  const { maxItems = 8, minToShowTab = 3, windowDays = 30 } = options;
  const [doc, setDoc] = useState<UsageStatsDocument>(() => readUsageStats(storageNamespace));

  const persist = useCallback(
    (updater: (prev: UsageStatsDocument) => UsageStatsDocument) => {
      setDoc((prev) => {
        const updated = updater(prev);
        writeUsageStats(updated, storageNamespace);
        return updated;
      });
    },
    [storageNamespace]
  );

  const recordUsage = useCallback(
    (itemId: string) => persist((prev) => recordUsageTimestamp(prev, itemId)),
    [persist]
  );

  const pinItem = useCallback(
    (id: string) =>
      persist((prev) =>
        prev.pinned.includes(id) ? prev : { ...prev, pinned: [...prev.pinned, id] }
      ),
    [persist]
  );

  const unpinItem = useCallback(
    (id: string) => persist((prev) => ({ ...prev, pinned: prev.pinned.filter((p) => p !== id) })),
    [persist]
  );

  const isPinned = useCallback((id: string) => doc.pinned.includes(id), [doc.pinned]);

  const favouriteItems = useMemo(() => {
    const isVisible = (id: string) => itemVisibility[id] === "VISIBLE";
    const now = Date.now();
    const windowMs = windowDays * 24 * 60 * 60 * 1000;

    const pinnedItems = doc.pinned
      .filter(isVisible)
      .map((id) => findItemById(items, id))
      .filter((item): item is ISidekickMenuItem => !!item);

    const ranked = Object.entries(doc.usage)
      .filter(([id]) => !doc.pinned.includes(id) && isVisible(id))
      .map(([id, timestamps]) => {
        const countInWindow = timestamps.filter((t) => now - t <= windowMs).length;
        const mostRecent = timestamps.length ? Math.max(...timestamps) : 0;
        return { id, countInWindow, mostRecent };
      })
      .filter((entry) => entry.countInWindow > 0)
      .sort((a, b) => b.countInWindow - a.countInWindow || b.mostRecent - a.mostRecent)
      .map((entry) => findItemById(items, entry.id))
      .filter((item): item is ISidekickMenuItem => !!item);

    return [...pinnedItems, ...ranked].slice(0, maxItems);
  }, [doc, items, itemVisibility, windowDays, maxItems]);

  return {
    favouriteItems,
    isEligibleForTab: favouriteItems.length >= minToShowTab,
    recordUsage,
    pinnedIds: doc.pinned,
    pinItem,
    unpinItem,
    isPinned,
  };
};
