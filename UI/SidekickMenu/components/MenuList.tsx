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
  startIndex: number;
  onTotalItemsCount?: (count: number) => void;
}

const MenuList: React.FC<MenuListProps> = ({
  items,
  level,
  parentIsOpened,
  startIndex,
  onTotalItemsCount,
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

  const [totalRendered, setTotalRendered] = React.useState(0);
  const renderedCounts = React.useRef<{ [key: string]: number }>({});

  const calculateTotal = React.useCallback(() => {
    let count = 0;
    processedItems.forEach((item) => {
      const isActuallyVisible = itemVisibility[item.id] === "VISIBLE";
      if (isActuallyVisible) {
        count++;
        if (item.children && openSubMenus[item.id]) {
          count += renderedCounts.current[item.id] || 0;
        }
      }
    });
    return count;
  }, [processedItems, itemVisibility, openSubMenus]);

  React.useEffect(() => {
    const newTotal = calculateTotal();
    if (newTotal !== totalRendered) {
      setTotalRendered(newTotal);
      onTotalItemsCount?.(newTotal);
    }
  }, [calculateTotal, totalRendered, onTotalItemsCount]);

  let currentRelativeIndex = 0;

  return (
    <ul
      className={`${styles.menuList} ${level > 0 ? styles.subMenu : ""} ${
        parentIsOpened ? styles.open : ""
      }`}
    >
      {processedItems.map((item) => {
        const isSubMenuOpen = openSubMenus[item.id];
        const isActuallyVisible = itemVisibility[item.id] === "VISIBLE";
        
        const myIndex = isActuallyVisible ? startIndex + currentRelativeIndex : -1;
        if (isActuallyVisible) {
          currentRelativeIndex++;
        }

        const subMenuStartIndex = startIndex + currentRelativeIndex;

        return (
          <React.Fragment key={item.id}>
            <MenuItem
              item={item}
              level={level}
              isSubMenuOpen={isSubMenuOpen}
              highlighted={highlightedIndex === myIndex}
            />
            {item.children && isSubMenuOpen && (
              <MenuList
                items={item.children}
                level={level + 1}
                parentIsOpened={isSubMenuOpen}
                startIndex={subMenuStartIndex}
                onTotalItemsCount={(count) => {
                  if (renderedCounts.current[item.id] !== count) {
                    renderedCounts.current[item.id] = count;
                    const updatedTotal = calculateTotal();
                    setTotalRendered(updatedTotal);
                    onTotalItemsCount?.(updatedTotal);
                  }
                }}
              />
            )}
            {item.children && isSubMenuOpen && isActuallyVisible && (
              (() => {
                currentRelativeIndex += renderedCounts.current[item.id] || 0;
                return null;
              })()
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default MenuList;
