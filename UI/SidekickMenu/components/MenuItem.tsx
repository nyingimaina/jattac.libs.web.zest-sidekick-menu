import React from "react";
import styles from "../../../Styles/SidekickMenu.module.css";
import { ISidekickMenuItem } from "../types";
import MenuItemSkeleton from "./MenuItemSkeleton";
import { highlightReactNode } from "../../../utils/reactNodeUtils";
import { useMenuContext } from "../context/MenuContext";

interface MenuItemProps {
  item: ISidekickMenuItem;
  level: number;
  isSubMenuOpen: boolean;
  highlighted: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  level,
  isSubMenuOpen,
  highlighted,
}) => {
  const {
    state: { itemVisibility, searchTerm },
    dispatch,
    chevronIcon,
  } = useMenuContext();

  const visibility = itemVisibility[item.id];

  if (visibility === "HIDDEN") {
    return null;
  }

  if (visibility === "PENDING") {
    return <MenuItemSkeleton key={`${item.id}-skeleton`} level={level} />;
  }

  const handleItemClick = () => {
    if (item.children) {
      dispatch({ type: "TOGGLE_SUBMENU", payload: item.id });
    } else {
      if (item.path) {
        window.location.href = item.path;
      } else if (item.onClick) {
        item.onClick();
      }
      dispatch({ type: "CLOSE_MENU" });
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
        {highlightReactNode(item.label, searchTerm, styles.highlight)}
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
