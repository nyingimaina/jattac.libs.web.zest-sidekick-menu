import React from "react";
import styles from "../../../Styles/SidekickMenu.module.css";

interface TabSwitcherProps {
  activeTab: "favourites" | "all";
  onChange: (tab: "favourites" | "all") => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onChange }) => (
  <div className={styles.tabSwitcher} role="tablist" aria-label="Menu view">
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === "favourites"}
      className={`${styles.tabButton} ${activeTab === "favourites" ? styles.tabButtonActive : ""}`}
      onClick={() => onChange("favourites")}
    >
      Favourites
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === "all"}
      className={`${styles.tabButton} ${activeTab === "all" ? styles.tabButtonActive : ""}`}
      onClick={() => onChange("all")}
    >
      All
    </button>
  </div>
);

export default TabSwitcher;
