import React from "react";
import styles from "../../../Styles/SidekickMenu.module.css"; // Relative path adjusted

interface MenuItemSkeletonProps {
  level: number;
}

const MenuItemSkeleton: React.FC<MenuItemSkeletonProps> = ({ level }) => (
  <li
    className={`${styles.menuItem} ${styles.menuItemSkeleton}`}
    style={{ paddingLeft: `${20 + level * 20}px` }}
  >
    <span className={`${styles.itemIcon} ${styles.skeleton}`} />
    <span className={`${styles.itemLabel} ${styles.skeleton}`} />
  </li>
);

export default MenuItemSkeleton;
