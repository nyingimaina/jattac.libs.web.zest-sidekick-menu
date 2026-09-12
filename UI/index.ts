import SidekickMenu from "./SidekickMenu/SidekickMenu";
import { clearSidekickMenuCache } from "./SidekickMenu/utils/cache";
import { clearSidekickMenuUsageStats } from "./SidekickMenu/utils/favouritesStorage";
import { ISidekickMenuItem, SidekickMenuProps } from "./SidekickMenu/types";
import ZestSidekickConfigProvider from "./context/ZestSidekickConfigProvider";
import { useZestSidekickConfig } from "./context/ZestSidekickConfigContext";
import type { ZestSidekickGlobalConfig } from "./context/ZestSidekickConfigContext";
import type {
  ZestSidekickCustomProps,
  ZestSidekickTheme,
  ZestSidekickVisualOptions,
  ZestSidekickMotionOptions,
  NavigationStyle,
  FavouritesOptions,
} from "./SidekickMenu/types";

export default SidekickMenu;
export {
  clearSidekickMenuCache,
  clearSidekickMenuUsageStats,
  ZestSidekickConfigProvider,
  useZestSidekickConfig,
};
export type {
  ISidekickMenuItem,
  SidekickMenuProps,
  ZestSidekickGlobalConfig,
  ZestSidekickCustomProps,
  ZestSidekickTheme,
  ZestSidekickVisualOptions,
  ZestSidekickMotionOptions,
  NavigationStyle,
  FavouritesOptions,
};
