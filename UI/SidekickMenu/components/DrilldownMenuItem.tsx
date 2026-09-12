import React from "react";
import styles from "../../../Styles/SidekickMenu.module.css";
import { ISidekickMenuItem } from "../types";
import { truncateDescription } from "../utils/description";
import { highlightReactNode } from "../../../utils/reactNodeUtils";

interface DrilldownMenuItemProps {
  item: ISidekickMenuItem;
  highlighted: boolean;
  staggerIndex?: number;
  chevronIcon?: React.ReactNode;
  searchTerm?: string;
  onActivate: (item: ISidekickMenuItem) => void;
  onDrillIn: (id: string) => void;
  numberBadge?: number;
  isPinned?: boolean;
  onTogglePin?: (id: string) => void;
  secondaryText?: string;
}

const DrilldownMenuItem: React.FC<DrilldownMenuItemProps> = ({
  item,
  highlighted,
  staggerIndex,
  chevronIcon,
  searchTerm = "",
  onActivate,
  onDrillIn,
  numberBadge,
  isPinned,
  onTogglePin,
  secondaryText,
}) => {
  const handleClick = () => {
    if (item.children) {
      onDrillIn(item.id);
    } else {
      onActivate(item);
    }
  };

  return (
    <li
      className={`${styles.menuItem} ${highlighted ? styles.highlighted : ""}`}
      onClick={handleClick}
      data-highlighted={highlighted}
      title={truncateDescription(item.description)}
      style={
        staggerIndex !== undefined && staggerIndex >= 0
          ? ({ "--zest-stagger-index": staggerIndex } as React.CSSProperties)
          : undefined
      }
    >
      <span className={styles.itemIcon}>{item.icon}</span>
      <span className={styles.itemTextGroup}>
        <span className={styles.itemLabel}>
          {highlightReactNode(item.label, searchTerm, styles.highlight)}
        </span>
        {secondaryText && <span className={styles.itemSecondaryText}>{secondaryText}</span>}
      </span>
      {numberBadge !== undefined && <span className={styles.numberBadge}>{numberBadge}</span>}
      {onTogglePin && (
        <button
          type="button"
          className={`${styles.pinToggle} ${isPinned ? styles.pinned : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onTogglePin(item.id);
          }}
          aria-label={isPinned ? "Unpin from favourites" : "Pin to favourites"}
          aria-pressed={!!isPinned}
        >
          {isPinned ? "★" : "☆"}
        </button>
      )}
      {item.children && <span className={styles.chevron}>{chevronIcon ?? "▶"}</span>}
    </li>
  );
};

export default DrilldownMenuItem;
