import React, { useState } from "react";
import styles from "../../../Styles/SidekickMenu.module.css";
import { GridIcon, StarIcon } from "./icons";

type Tab = "favourites" | "all";

interface TabSwitcherProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onChange }) => {
  // Icon "pop" animations only play after the user switches tabs, not every time the menu opens.
  const [hasSwitched, setHasSwitched] = useState(false);

  const select = (tab: Tab) => {
    if (tab !== activeTab) setHasSwitched(true);
    onChange(tab);
  };

  const tabClass = (tab: Tab) =>
    `${styles.tabButton} ${activeTab === tab ? styles.tabButtonActive : ""}`;

  return (
    <div
      className={styles.tabSwitcher}
      role="tablist"
      aria-label="Menu view"
      data-active-tab={activeTab}
      data-animate={hasSwitched ? "true" : undefined}
    >
      <span className={styles.tabIndicator} aria-hidden="true" />
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "favourites"}
        className={tabClass("favourites")}
        onClick={() => select("favourites")}
      >
        <StarIcon filled={activeTab === "favourites"} className={`${styles.tabIcon} ${styles.tabIconStar}`} />
        <span>Favourites</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "all"}
        className={tabClass("all")}
        onClick={() => select("all")}
      >
        <GridIcon className={`${styles.tabIcon} ${styles.tabIconGrid}`} />
        <span>All</span>
      </button>
    </div>
  );
};

export default TabSwitcher;
