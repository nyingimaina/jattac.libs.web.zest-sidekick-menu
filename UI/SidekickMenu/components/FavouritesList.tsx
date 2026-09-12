import React from "react";
import styles from "../../../Styles/SidekickMenu.module.css";
import { ISidekickMenuItem } from "../types";
import DrilldownMenuItem from "./DrilldownMenuItem";
import { getBreadcrumbPath } from "../utils/breadcrumb";
import { extractTextFromReactNode } from "../../../utils/reactNodeUtils";

interface FavouritesListProps {
  favouriteItems: ISidekickMenuItem[];
  allItems: ISidekickMenuItem[];
  highlightedIndex: number;
  onActivate: (item: ISidekickMenuItem) => void;
  isPinned: (id: string) => boolean;
  onTogglePin: (id: string) => void;
  showNumberBadges?: boolean;
}

const getSecondaryText = (item: ISidekickMenuItem, allItems: ISidekickMenuItem[]): string | undefined => {
  if (item.description) return item.description;
  const breadcrumb = getBreadcrumbPath(allItems, item.id);
  if (breadcrumb.length === 0) return undefined;
  return breadcrumb.map((ancestor) => extractTextFromReactNode(ancestor.label)).join(" › ");
};

const FavouritesList: React.FC<FavouritesListProps> = ({
  favouriteItems,
  allItems,
  highlightedIndex,
  onActivate,
  isPinned,
  onTogglePin,
  showNumberBadges,
}) => {
  if (favouriteItems.length === 0) {
    return <div className={styles.noResults}>Your frequently used items will appear here.</div>;
  }

  return (
    <ul className={styles.menuList}>
      {favouriteItems.map((item, index) => {
        // Only pinned items have a stable order, so only they are eligible for a number shortcut
        // (see useNumberedShortcuts wiring in SidekickMenu.tsx). Pinned items are always sorted to
        // the front of favouriteItems, so their plain list index already matches their position in
        // the pinned-only eligible list the keyboard hook uses.
        const pinned = isPinned(item.id);
        return (
          <DrilldownMenuItem
            key={item.id}
            item={item}
            highlighted={highlightedIndex === index}
            staggerIndex={index}
            onActivate={onActivate}
            onDrillIn={() => {}}
            isPinned={pinned}
            onTogglePin={onTogglePin}
            numberBadge={showNumberBadges && pinned && index < 9 ? index + 1 : undefined}
            secondaryText={getSecondaryText(item, allItems)}
          />
        );
      })}
    </ul>
  );
};

export default FavouritesList;
