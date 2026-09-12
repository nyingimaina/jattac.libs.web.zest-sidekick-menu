import React from "react";
import styles from "../../../Styles/SidekickMenu.module.css";
import { ISidekickMenuItem } from "../types";
import DrilldownMenuItem from "./DrilldownMenuItem";
import MenuItemSkeleton from "./MenuItemSkeleton";
import { getFilteredItems } from "../utils/search";

type ItemVisibilityMap = { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };

interface DrilldownMenuListProps {
  items: ISidekickMenuItem[];
  itemVisibility: ItemVisibilityMap;
  searchTerm: string;
  alwaysShowUnsearchableItems: boolean;
  highlightedIndex: number;
  chevronIcon?: React.ReactNode;
  onDrillIn: (id: string) => void;
  onActivate: (item: ISidekickMenuItem) => void;
  showNumberBadges?: boolean;
}

const DrilldownMenuList: React.FC<DrilldownMenuListProps> = ({
  items,
  itemVisibility,
  searchTerm,
  alwaysShowUnsearchableItems,
  highlightedIndex,
  chevronIcon,
  onDrillIn,
  onActivate,
  showNumberBadges,
}) => {
  const processedItems = getFilteredItems(items, searchTerm, alwaysShowUnsearchableItems);

  let visibleIndex = -1;
  // Only leaf items are eligible for a number shortcut/badge (see useNumberedShortcuts wiring
  // in SidekickMenu.tsx), so this must be indexed separately from `visibleIndex` — otherwise a
  // badge shown next to a leaf item would not match the digit that actually activates it whenever
  // the level mixes parent and leaf items.
  let eligibleIndex = -1;

  return (
    <ul className={styles.menuList}>
      {processedItems.map((item) => {
        const visibility = itemVisibility[item.id];

        if (visibility === "HIDDEN") return null;

        if (visibility === "PENDING" || (visibility === undefined && item.visibilityControl?.isVisibleResolver)) {
          return <MenuItemSkeleton key={`${item.id}-skeleton`} level={0} />;
        }

        visibleIndex += 1;
        const myIndex = visibleIndex;

        let numberBadge: number | undefined;
        if (!item.children) {
          eligibleIndex += 1;
          if (showNumberBadges && eligibleIndex < 9) {
            numberBadge = eligibleIndex + 1;
          }
        }

        return (
          <DrilldownMenuItem
            key={item.id}
            item={item}
            highlighted={highlightedIndex === myIndex}
            staggerIndex={myIndex}
            chevronIcon={chevronIcon}
            searchTerm={searchTerm}
            onDrillIn={onDrillIn}
            onActivate={onActivate}
            numberBadge={numberBadge}
          />
        );
      })}
    </ul>
  );
};

export default DrilldownMenuList;
