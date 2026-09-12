import { renderHook, act } from '@testing-library/react';
import { useThemeDetection } from './useThemeDetection';

type Listener = (event: MediaQueryListEvent) => void;

const setMatchMedia = (initialMatches: boolean) => {
  let listener: Listener | undefined;
  const mql = {
    matches: initialMatches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: jest.fn((_event: string, cb: Listener) => {
      listener = cb;
    }),
    removeEventListener: jest.fn(),
  };
  window.matchMedia = jest.fn().mockReturnValue(mql);
  return {
    mql,
    fireChange: (matches: boolean) => {
      mql.matches = matches;
      act(() => listener?.({ matches } as MediaQueryListEvent));
    },
  };
};

describe('useThemeDetection', () => {
  it('returns "dark" when the OS prefers dark on mount', () => {
    setMatchMedia(true);
    const { result } = renderHook(() => useThemeDetection());
    expect(result.current).toBe('dark');
  });

  it('returns "light" when the OS prefers light on mount', () => {
    setMatchMedia(false);
    const { result } = renderHook(() => useThemeDetection());
    expect(result.current).toBe('light');
  });

  it('updates when the OS preference changes', () => {
    const { fireChange } = setMatchMedia(false);
    const { result } = renderHook(() => useThemeDetection());
    expect(result.current).toBe('light');

    fireChange(true);
    expect(result.current).toBe('dark');
  });

  it('removes the media query listener on unmount', () => {
    const { mql } = setMatchMedia(false);
    const { unmount } = renderHook(() => useThemeDetection());
    unmount();
    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('does not throw when window.matchMedia is unavailable (SSR guard)', () => {
    const original = window.matchMedia;
    (window as { matchMedia?: typeof window.matchMedia }).matchMedia = undefined;

    expect(() => renderHook(() => useThemeDetection())).not.toThrow();

    window.matchMedia = original;
  });
});
