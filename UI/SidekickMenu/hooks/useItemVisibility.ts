import { useState, useEffect } from "react";
import { ISidekickMenuItem } from "../types";
import { CACHE_KEY } from "../utils/cache";

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

export const useItemVisibility = (
  items: ISidekickMenuItem[],
  cacheLifetime: number = 24
): ItemVisibilityMap => {
  const [itemVisibility, setItemVisibility] = useState<ItemVisibilityMap>(() => {
    // Initial state calculation to prevent a flash of incorrect content
    const initialMap: ItemVisibilityMap = {};
    const now = new Date().getTime();
    let cache: {
      [key: string]: { visible: boolean; expires: number };
    } = {};

    if (typeof window !== "undefined") {
      try {
        cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      } catch (error) {
        console.error("Error reading SidekickMenu cache:", error);
        cache = {};
      }
    }

    const populateInitialMap = (itemsToProcess: ISidekickMenuItem[]) => {
      itemsToProcess.forEach((item) => {
        if (item.visibilityControl?.isVisibleResolver) {
          const cachedItem = cache[item.id];
          if (cachedItem && cachedItem.expires > now) {
            initialMap[item.id] = cachedItem.visible ? "VISIBLE" : "HIDDEN";
          } else {
            initialMap[item.id] = "PENDING"; // Mark as pending if resolver needed
          }
        } else {
          initialMap[item.id] = "VISIBLE"; // Default to visible if no resolver
        }
        if (item.children) {
          populateInitialMap(item.children);
        }
      });
    };
    populateInitialMap(items);
    return initialMap;
  });

  useEffect(() => {
    const now = new Date().getTime();
    let cache: {
      [key: string]: { visible: boolean; expires: number };
    } = {};

    if (typeof window !== "undefined") {
      try {
        cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      } catch (error) {
        console.error("Error reading SidekickMenu cache:", error);
        cache = {};
      }
    }

    const itemsToResolve: ISidekickMenuItem[] = [];
    const currentItemVisibility: ItemVisibilityMap = {};

    const collectItemsToResolve = (itemsToProcess: ISidekickMenuItem[]) => {
      itemsToProcess.forEach((item) => {
        if (item.visibilityControl?.isVisibleResolver) {
          const cachedItem = cache[item.id];
          if (cachedItem && cachedItem.expires > now) {
            // Already handled in initial state, but re-evaluate for effect dependencies
            currentItemVisibility[item.id] = cachedItem.visible ? "VISIBLE" : "HIDDEN";
          } else {
            // Only add to resolve list if it's truly pending
            if (itemVisibility[item.id] !== "VISIBLE" && itemVisibility[item.id] !== "HIDDEN") {
                itemsToResolve.push(item);
            }
          }
        } else {
          currentItemVisibility[item.id] = "VISIBLE"; // Also handled in initial state
        }
        if (item.children) {
          collectItemsToResolve(item.children);
        }
      });
    };
    collectItemsToResolve(items);

    // Filter out items that are already resolved from the initial state
    const trulyPendingItems = itemsToResolve.filter(item => itemVisibility[item.id] === "PENDING");

    if (trulyPendingItems.length > 0) {
        trulyPendingItems.forEach(async (item) => {
            const isVisible = await item.visibilityControl!.isVisibleResolver!();
            setItemVisibility((prevState) => {
                const status: "VISIBLE" | "HIDDEN" | "PENDING" = isVisible ? "VISIBLE" : "HIDDEN";
                const newState = {
                    ...prevState,
                    [item.id]: status,
                };

                if (item.visibilityControl?.isCachable && typeof window !== "undefined") {
                    const newCache = { ...cache };
                    newCache[item.id] = {
                        visible: isVisible,
                        expires: now + cacheLifetime * 60 * 60 * 1000,
                    };
                    try {
                        localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
                    } catch (error) {
                        console.error("Error writing SidekickMenu cache:", error);
                    }
                }
                return newState;
            });
        });
    }

  }, [items, cacheLifetime]); // Dependencies for useEffect

  return itemVisibility;
};
