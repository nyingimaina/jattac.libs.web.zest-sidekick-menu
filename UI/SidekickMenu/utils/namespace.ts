export type StorageKind = "visibilityCache" | "usageStats" | "railState";

const LEGACY_DEFAULT_KEYS: Record<StorageKind, string> = {
  visibilityCache: "sidekickMenuVisibilityCache",
  usageStats: "sidekickMenuUsageStats",
  railState: "sidekickMenuRailState",
};

export const getStorageKey = (kind: StorageKind, storageNamespace?: string): string => {
  if (!storageNamespace) {
    return LEGACY_DEFAULT_KEYS[kind];
  }
  return `sidekickMenu:${storageNamespace}:${kind}`;
};

// Dev-mode-only registry: detects two mounted SidekickMenu instances resolving to the
// same storage namespace but backed by different item trees, which would silently
// share (and corrupt) each other's favourites/usage data.
const registry = new Map<string, unknown[]>();

export const __resetNamespaceRegistryForTests = () => {
  registry.clear();
};

export const registerNamespaceUsage = (
  resolvedNamespaceKey: string,
  items: unknown[]
): (() => void) => {
  if (process.env.NODE_ENV !== "production") {
    const existing = registry.get(resolvedNamespaceKey);
    if (existing && existing !== items) {
      console.warn(
        `[SidekickMenu] Two menu instances are sharing storage (resolved key "${resolvedNamespaceKey}") ` +
          "but have different item sets. Pass distinct `storageNamespace` props to each instance to avoid " +
          "favourites/visibility data bleeding between them."
      );
    }
    registry.set(resolvedNamespaceKey, items);
  }

  return () => {
    if (registry.get(resolvedNamespaceKey) === items) {
      registry.delete(resolvedNamespaceKey);
    }
  };
};
