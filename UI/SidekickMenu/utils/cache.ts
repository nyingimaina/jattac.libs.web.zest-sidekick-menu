export const CACHE_KEY = "sidekickMenuVisibilityCache";

export const clearSidekickMenuCache = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error("Error clearing SidekickMenu cache:", error);
    }
  }
};
