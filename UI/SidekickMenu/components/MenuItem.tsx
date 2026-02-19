import React from "react";
import styles from "../../../Styles/SidekickMenu.module.css";
import { ISidekickMenuItem } from "../types";
import MenuItemSkeleton from "./MenuItemSkeleton";
import { highlightReactNode } from "../../../utils/reactNodeUtils";

interface MenuItemProps {
  item: ISidekickMenuItem;
  level: number;
  itemVisibility: { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };
  isSubMenuOpen: boolean;
  toggleSubMenu: (id: string) => void;
  currentSearchTerm: string;
  highlighted: boolean;
  chevronIcon?: React.ReactNode;
  closeMenu: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  level,
  itemVisibility,
  isSubMenuOpen,
  toggleSubMenu,
  currentSearchTerm,
  highlighted,
  chevronIcon,
  closeMenu,
}) => {
  const visibility = itemVisibility[item.id];

  if (visibility === "HIDDEN") {
    return null;
  }

  if (visibility === "PENDING") {
    return <MenuItemSkeleton key={`${item.id}-skeleton`} level={level} />;
  }

  const handleItemClick = () => {
    if (item.children) {
      toggleSubMenu(item.id);
    } else if (item.path) {
      window.location.href = item.path;
      closeMenu();
    } else if (item.onClick) {
      item.onClick();
      closeMenu();
    }
  };

  return (
    <li
      className={`${styles.menuItem} ${highlighted ? styles.highlighted : ""}`}
      style={{ paddingLeft: `${20 + level * 20}px` }}
      onClick={handleItemClick}
      data-highlighted={highlighted}
    >
      <span className={styles.itemIcon}>{item.icon}</span>
      <span className={styles.itemLabel}>
        {highlightReactNode(item.label, currentSearchTerm, styles.highlight)}
      </span>
      {item.children && (
        <span
          className={`${styles.chevron} ${isSubMenuOpen ? styles.open : ""}`}
        >
          {chevronIcon ?? "▼"}
        </span>
      )}
    </li>
  );
};

export default MenuItem;
