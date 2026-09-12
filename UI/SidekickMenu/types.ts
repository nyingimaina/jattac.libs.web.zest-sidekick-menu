import React from "react";

export type ISidekickMenuItem = {
  id: string;
  label: React.ReactNode;
  icon: React.ReactNode;
  searchTerms: string;
  /** Short context shown in the Favourites list and as a tooltip (recommended max 40 characters). */
  description?: string;
  visibilityControl?: {
    isVisibleResolver?: (() => Promise<boolean>) | (() => boolean) | boolean;
    isCachable?: boolean;
  };
} & (
  | { path: string; onClick?: never; children?: never }
  | { path?: never; onClick: () => void; children?: never }
  | { path?: never; onClick?: never; children: ISidekickMenuItem[] }
);

export type NavigationStyle = "drilldown" | "accordion";

export interface FavouritesOptions {
  maxItems?: number;
  minToShowTab?: number;
  windowDays?: number;
}

export type ZestSidekickTheme = "light" | "dark" | "system";

export interface ZestSidekickVisualOptions {
  size?: "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg";
  surface?: "solid" | "translucent";
}

export interface ZestSidekickMotionOptions {
  intensity?: "subtle" | "standard" | "playful";
  reducedMotion?: "auto" | "always" | "never";
}

export interface ZestSidekickCustomProps {
  theme?: ZestSidekickTheme;
  visualOptions?: ZestSidekickVisualOptions;
  motionOptions?: ZestSidekickMotionOptions;
}

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
  side?: "left" | "right" | "auto";
  zest?: ZestSidekickCustomProps;
  navigationStyle?: NavigationStyle;
  favouritesEnabled?: boolean;
  favouritesOptions?: FavouritesOptions;
  storageNamespace?: string;
  railCollapsible?: boolean;
  swipeEnabled?: boolean;
  numberedShortcutsEnabled?: boolean;
}
