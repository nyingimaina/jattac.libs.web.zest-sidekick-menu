import React from 'react';
import { renderHook } from '@testing-library/react';
import { useZestConfig } from './useZestConfig';
import ZestSidekickConfigProvider from '../context/ZestSidekickConfigProvider';
import { ZestSidekickCustomProps } from '../SidekickMenu/types';

describe('useZestConfig', () => {
  it('returns an empty object when neither global nor local config is supplied', () => {
    const { result } = renderHook(() => useZestConfig());
    expect(result.current).toEqual({});
  });

  it('returns local props when only local config is supplied', () => {
    const local: ZestSidekickCustomProps = { theme: 'dark' };
    const { result } = renderHook(() => useZestConfig(local));
    expect(result.current).toEqual({ theme: 'dark' });
  });

  it('returns global defaultProps when only global config is supplied', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ZestSidekickConfigProvider config={{ defaultProps: { theme: 'light' } }}>
        {children}
      </ZestSidekickConfigProvider>
    );
    const { result } = renderHook(() => useZestConfig(), { wrapper });
    expect(result.current).toEqual({ theme: 'light' });
  });

  it('local config wins over global config for the same field', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ZestSidekickConfigProvider config={{ defaultProps: { theme: 'light' } }}>
        {children}
      </ZestSidekickConfigProvider>
    );
    const { result } = renderHook(() => useZestConfig({ theme: 'dark' }), { wrapper });
    expect(result.current.theme).toBe('dark');
  });

  it('deep-merges nested objects instead of replacing them wholesale', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ZestSidekickConfigProvider
        config={{ defaultProps: { motionOptions: { intensity: 'subtle', reducedMotion: 'always' } } }}
      >
        {children}
      </ZestSidekickConfigProvider>
    );
    const { result } = renderHook(
      () => useZestConfig({ motionOptions: { intensity: 'playful' } }),
      { wrapper }
    );
    expect(result.current.motionOptions).toEqual({
      intensity: 'playful',
      reducedMotion: 'always',
    });
  });
});
