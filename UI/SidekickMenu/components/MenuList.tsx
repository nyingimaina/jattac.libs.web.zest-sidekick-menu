import React from "react";
import styles from "../../../Styles/SidekickMenu.module.css";
import { ISidekickMenuItem } from "../types";
import MenuItem from "./MenuItem";
import { getFilteredItems } from "../utils/search";

interface MenuListProps {
  items: ISidekickMenuItem[];
  level: number;
  itemVisibility: { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };
  openSubMenus: { [key: string]: boolean };
  toggleSubMenu: (id: string) => void;
  currentSearchTerm: string;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  chevronIcon?: React.ReactNode;
  closeMenu: () => void;
  alwaysShowUnsearchableItems: boolean;
  parentIsOpened: boolean; // New prop
}

const MenuList: React.FC<MenuListProps> = ({
  items,
  level,
  itemVisibility,
  openSubMenus,
  toggleSubMenu,
  currentSearchTerm,
  highlightedIndex,
  setHighlightedIndex,
  chevronIcon,
  closeMenu,
  alwaysShowUnsearchableItems,
  parentIsOpened, // Destructure new prop
}) => {
  const processedItems = getFilteredItems(
    items,
    currentSearchTerm,
    alwaysShowUnsearchableItems,
    itemVisibility
  );

  // This internal counter is to map the flattened highlightedIndex to the
  // correct item in the processed (filtered) list for display.
  let globalItemIndex = -1;

  return (
    <ul className={`${styles.menuList} ${level > 0 ? styles.subMenu : ""} ${parentIsOpened ? styles.open : ""}`}>
      {processedItems.map((item) => {
        const isSubMenuOpen = openSubMenus[item.id];
        // Only increment globalItemIndex for actual MenuItem components rendered.
        // Skeletons or nulls are handled internally by MenuItem, and don't count
        // towards navigable items in the flattened list.
        const isActuallyVisible = itemVisibility[item.id] === "VISIBLE";
        if (isActuallyVisible) {
          globalItemIndex++;
        }

        return (
          <React.Fragment key={item.id}>
            <MenuItem
              item={item}
              level={level}
              itemVisibility={itemVisibility}
              isSubMenuOpen={isSubMenuOpen}
              toggleSubMenu={toggleSubMenu}
              currentSearchTerm={currentSearchTerm}
              highlighted={highlightedIndex === globalItemIndex}
              chevronIcon={chevronIcon}
              closeMenu={closeMenu}
            />
            {item.children && isSubMenuOpen && (
              <MenuList
                items={item.children}
                level={level + 1}
                itemVisibility={itemVisibility}
                openSubMenus={openSubMenus}
                toggleSubMenu={toggleSubMenu}
                currentSearchTerm={currentSearchTerm}
                highlightedIndex={highlightedIndex}
                setHighlightedIndex={setHighlightedIndex}
                chevronIcon={chevronIcon}
                closeMenu={closeMenu}
                alwaysShowUnsearchableItems={alwaysShowUnsearchableItems}
                parentIsOpened={isSubMenuOpen} // Pass down isSubMenuOpen for recursive calls
              />
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default MenuList;
