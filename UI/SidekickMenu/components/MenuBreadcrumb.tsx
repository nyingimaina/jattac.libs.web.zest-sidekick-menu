import React from "react";
import styles from "../../../Styles/SidekickMenu.module.css";
import { ISidekickMenuItem } from "../types";
import { extractTextFromReactNode } from "../../../utils/reactNodeUtils";

interface MenuBreadcrumbProps {
  /** Resolved ancestor chain plus the current item, in order (root not included). */
  path: ISidekickMenuItem[];
  /** Index into `path` to jump to; -1 means the root. */
  onNavigate: (index: number) => void;
  onBack: () => void;
}

const MenuBreadcrumb: React.FC<MenuBreadcrumbProps> = ({ path, onNavigate, onBack }) => {
  if (path.length === 0) return null;

  const current = path[path.length - 1];

  return (
    <div className={styles.breadcrumb} role="navigation" aria-label="Menu breadcrumb">
      <button type="button" className={styles.breadcrumbBack} onClick={onBack} aria-label="Back">
        ‹
      </button>
      <button type="button" className={styles.breadcrumbCrumb} onClick={() => onNavigate(-1)}>
        Menu
      </button>
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        return (
          <React.Fragment key={item.id}>
            <span className={styles.breadcrumbSeparator} aria-hidden="true">
              ›
            </span>
            {isLast ? (
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {item.label}
              </span>
            ) : (
              <button type="button" className={styles.breadcrumbCrumb} onClick={() => onNavigate(index)}>
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
      <span className={styles.srOnly} aria-live="polite">
        {`Viewing ${extractTextFromReactNode(current.label)}`}
      </span>
    </div>
  );
};

export default MenuBreadcrumb;
