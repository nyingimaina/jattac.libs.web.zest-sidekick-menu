import React from "react";
import ZestSidekickConfigContext, { ZestSidekickGlobalConfig } from "./ZestSidekickConfigContext";

interface ZestSidekickConfigProviderProps {
  config: ZestSidekickGlobalConfig;
  children: React.ReactNode;
}

const ZestSidekickConfigProvider: React.FC<ZestSidekickConfigProviderProps> = ({
  config,
  children,
}) => (
  <ZestSidekickConfigContext.Provider value={config}>
    {children}
  </ZestSidekickConfigContext.Provider>
);

export default ZestSidekickConfigProvider;
