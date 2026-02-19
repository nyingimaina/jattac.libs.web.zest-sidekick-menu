import React from "react";

export type ISidekickMenuItem = {
  id: string;
  label: React.ReactNode;
  icon: React.ReactNode;
  searchTerms: string;
  isVisible?: (() => Promise<boolean> | boolean) | boolean;
  isCachable?: boolean;
} & (
  | { path: string; onClick?: never; children?: never }
  | { path?: never; onClick: () => void; children?: never }
  | { path?: never; onClick?: never; children: ISidekickMenuItem[] }
);

export interface SidekickMenuProps {
  items: ISidekickMenuItem[];
  searchEnabled?: boolean;
  searchAutoFocus?: boolean;
  searchPlaceholder?: string;
  alwaysShowUnsearchableItems?: boolean;
  openOnDesktop?: boolean;
  searchIcon?: React.ReactNode;
  chevronIcon?: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  cacheLifetime?: number;
}

export interface ISidekickMenuState {
  isOpen: boolean;
  searchTerm: string;
  highlightedIndex: number;
  openSubMenus: { [key: string]: boolean };
  itemVisibility: { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };
}
