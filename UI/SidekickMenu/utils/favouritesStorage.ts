import { getStorageKey } from "./namespace";

export interface UsageStatsDocument {
  usage: { [itemId: string]: number[] };
  pinned: string[];
}

const EMPTY_DOCUMENT: UsageStatsDocument = { usage: {}, pinned: [] };
const MAX_TIMESTAMPS_PER_ITEM = 20;

export const readUsageStats = (storageNamespace?: string): UsageStatsDocument => {
  if (typeof window === "undefined") return { ...EMPTY_DOCUMENT };
  try {
    const raw = localStorage.getItem(getStorageKey("usageStats", storageNamespace));
    if (!raw) return { usage: {}, pinned: [] };
    const parsed = JSON.parse(raw);
    return {
      usage: parsed.usage ?? {},
      pinned: parsed.pinned ?? [],
    };
  } catch (error) {
    console.error("Error reading SidekickMenu usage stats:", error);
    return { usage: {}, pinned: [] };
  }
};

export const writeUsageStats = (doc: UsageStatsDocument, storageNamespace?: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey("usageStats", storageNamespace), JSON.stringify(doc));
  } catch (error) {
    console.error("Error writing SidekickMenu usage stats:", error);
  }
};

export const clearSidekickMenuUsageStats = (storageNamespace?: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getStorageKey("usageStats", storageNamespace));
  } catch (error) {
    console.error("Error clearing SidekickMenu usage stats:", error);
  }
};

export const recordUsageTimestamp = (
  doc: UsageStatsDocument,
  itemId: string,
  now: number = Date.now()
): UsageStatsDocument => {
  const existing = doc.usage[itemId] ?? [];
  const updatedTimestamps = [...existing, now].slice(-MAX_TIMESTAMPS_PER_ITEM);
  return {
    ...doc,
    usage: {
      ...doc.usage,
      [itemId]: updatedTimestamps,
    },
  };
};
