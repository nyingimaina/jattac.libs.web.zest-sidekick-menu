import React from 'react';
import { renderHook } from '@testing-library/react';
import { useZestSidekickConfig } from './ZestSidekickConfigContext';
import ZestSidekickConfigProvider from './ZestSidekickConfigProvider';

describe('ZestSidekickConfigContext', () => {
  it('returns a safe empty default when used outside a provider', () => {
    const { result } = renderHook(() => useZestSidekickConfig());
    expect(result.current).toEqual({});
  });

  it('returns the supplied config when used inside a provider', () => {
    const config = { defaultProps: { theme: 'dark' as const } };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ZestSidekickConfigProvider config={config}>{children}</ZestSidekickConfigProvider>
    );

    const { result } = renderHook(() => useZestSidekickConfig(), { wrapper });
    expect(result.current).toEqual(config);
  });
});
