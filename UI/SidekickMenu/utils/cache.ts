import { getStorageKey } from "./namespace";

export const CACHE_KEY = getStorageKey("visibilityCache");

export const clearSidekickMenuCache = (storageNamespace?: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(getStorageKey("visibilityCache", storageNamespace));
    } catch (error) {
      console.error("Error clearing SidekickMenu cache:", error);
    }
  }
};
