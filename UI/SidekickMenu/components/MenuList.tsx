import React from "react";
import styles from "../../../Styles/SidekickMenu.module.css";
import { ISidekickMenuItem } from "../types";
import MenuItem from "./MenuItem";
import { getFilteredItems } from "../utils/search";
import { useMenuContext } from "../context/MenuContext";

interface MenuListProps {
  items: ISidekickMenuItem[];
  level: number;
  parentIsOpened: boolean;
}

const MenuList: React.FC<MenuListProps> = ({
  items,
  level,
  parentIsOpened,
}) => {
  const {
    state: { itemVisibility, openSubMenus, searchTerm, highlightedIndex },
    alwaysShowUnsearchableItems,
  } = useMenuContext();

  const processedItems = getFilteredItems(
    items,
    searchTerm,
    alwaysShowUnsearchableItems
  );

  let globalItemIndex = -1;

  return (
    <ul className={`${styles.menuList} ${level > 0 ? styles.subMenu : ""} ${parentIsOpened ? styles.open : ""}`}>
      {processedItems.map((item) => {
        const isSubMenuOpen = openSubMenus[item.id];
        const isActuallyVisible = itemVisibility[item.id] === "VISIBLE";
        if (isActuallyVisible) {
          globalItemIndex++;
        }

        return (
          <React.Fragment key={item.id}>
            <MenuItem
              item={item}
              level={level}
              isSubMenuOpen={isSubMenuOpen}
              highlighted={highlightedIndex === globalItemIndex}
            />
            {item.children && isSubMenuOpen && (
              <MenuList
                items={item.children}
                level={level + 1}
                parentIsOpened={isSubMenuOpen}
              />
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default MenuList;
