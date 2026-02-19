import { useState, useEffect } from "react";
import { ISidekickMenuItem } from "../types";
import { CACHE_KEY } from "../utils/cache";

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

export const useItemVisibility = (
  items: ISidekickMenuItem[],
  cacheLifetime: number = 24
): ItemVisibilityMap => {
  const [itemVisibility, setItemVisibility] = useState<ItemVisibilityMap>({});

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

    const visibilityPromises: Promise<{ id: string, isVisible: boolean, isCachable?: boolean }>[] = [];
    const initialVisibility: ItemVisibilityMap = {};

    const processItems = (itemsToProcess: ISidekickMenuItem[]) => {
      itemsToProcess.forEach((item) => {
        if (item.isVisible === undefined) {
          initialVisibility[item.id] = "VISIBLE";
        } else if (item.isCachable && cache[item.id] && cache[item.id].expires > now) {
          initialVisibility[item.id] = cache[item.id].visible ? "VISIBLE" : "HIDDEN";
        } else if (typeof item.isVisible === "function") {
          initialVisibility[item.id] = "PENDING";
          const visibilityFn = item.isVisible;
          visibilityPromises.push(
            (async () => {
              const result = visibilityFn();
              const isVisible = result instanceof Promise ? await result : result;
              return { id: item.id, isVisible: !!isVisible, isCachable: item.isCachable };
            })()
          );
        } else {
          initialVisibility[item.id] = item.isVisible ? "VISIBLE" : "HIDDEN";
        }

        if (item.children) {
          processItems(item.children);
        }
      });
    };

    processItems(items);
    setItemVisibility(initialVisibility);

    if (visibilityPromises.length > 0) {
      Promise.all(visibilityPromises).then((results) => {
        const cacheUpdates: { [key: string]: { visible: boolean; expires: number } } = {};
        
        setItemVisibility((prev) => {
          const newVisibility = { ...prev };
          results.forEach(({ id, isVisible, isCachable }) => {
            newVisibility[id] = isVisible ? "VISIBLE" : "HIDDEN";
            if (isCachable) {
              cacheUpdates[id] = {
                visible: isVisible,
                expires: new Date().getTime() + cacheLifetime * 60 * 60 * 1000,
              };
            }
          });
          return newVisibility;
        });

        if (Object.keys(cacheUpdates).length > 0 && typeof window !== 'undefined') {
          try {
            const currentCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
            const newCache = { ...currentCache, ...cacheUpdates };
            localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
          } catch(e) {
            console.error("Error updating cache", e)
          }
        }
      });
    }
  }, [items, cacheLifetime]);

  return itemVisibility;
};
