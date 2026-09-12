import { createContext, useContext } from "react";
import { ZestSidekickCustomProps } from "../SidekickMenu/types";

export interface ZestSidekickGlobalConfig {
  defaultProps?: ZestSidekickCustomProps;
}

const DEFAULT_ZEST_SIDEKICK_CONFIG: ZestSidekickGlobalConfig = {};

export const ZestSidekickConfigContext = createContext<ZestSidekickGlobalConfig>(
  DEFAULT_ZEST_SIDEKICK_CONFIG
);

export const useZestSidekickConfig = (): ZestSidekickGlobalConfig =>
  useContext(ZestSidekickConfigContext);

export default ZestSidekickConfigContext;
