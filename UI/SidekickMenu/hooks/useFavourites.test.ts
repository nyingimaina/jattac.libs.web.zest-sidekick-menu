import { renderHook, act } from '@testing-library/react';
import { useFavourites } from './useFavourites';
import { ISidekickMenuItem } from '../types';
import { writeUsageStats } from '../utils/favouritesStorage';

const items: ISidekickMenuItem[] = [
  { id: 'a', label: 'A', icon: '', searchTerms: '', path: '/a' },
  { id: 'b', label: 'B', icon: '', searchTerms: '', path: '/b' },
  { id: 'c', label: 'C', icon: '', searchTerms: '', path: '/c' },
  { id: 'hidden', label: 'Hidden', icon: '', searchTerms: '', path: '/hidden' },
];

const allVisible = { a: 'VISIBLE', b: 'VISIBLE', c: 'VISIBLE', hidden: 'HIDDEN' } as const;

describe('useFavourites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no favourites and is not eligible for the tab', () => {
    const { result } = renderHook(() => useFavourites(items, allVisible));
    expect(result.current.favouriteItems).toEqual([]);
    expect(result.current.isEligibleForTab).toBe(false);
  });

  it('recordUsage makes an item appear in favouriteItems', () => {
    const { result } = renderHook(() => useFavourites(items, allVisible));
    act(() => result.current.recordUsage('a'));
    expect(result.current.favouriteItems.map((i) => i.id)).toEqual(['a']);
  });

  it('ranks by usage count within the window, descending', () => {
    const { result } = renderHook(() => useFavourites(items, allVisible));
    act(() => {
      result.current.recordUsage('a');
      result.current.recordUsage('b');
      result.current.recordUsage('b');
      result.current.recordUsage('b');
    });
    expect(result.current.favouriteItems.map((i) => i.id)).toEqual(['b', 'a']);
  });

  it('never surfaces an item whose visibility resolves to HIDDEN, even with usage history', () => {
    writeUsageStats({ usage: { hidden: [Date.now(), Date.now(), Date.now()] }, pinned: [] });
    const { result } = renderHook(() => useFavourites(items, allVisible));
    expect(result.current.favouriteItems.map((i) => i.id)).not.toContain('hidden');
  });

  it('excludes usage outside the rolling window', () => {
    const thirtyOneDaysAgo = Date.now() - 31 * 24 * 60 * 60 * 1000;
    writeUsageStats({ usage: { a: [thirtyOneDaysAgo] }, pinned: [] });
    const { result } = renderHook(() => useFavourites(items, allVisible, { windowDays: 30 }));
    expect(result.current.favouriteItems).toEqual([]);
  });

  it('caps the list at favouritesOptions.maxItems', () => {
    const { result } = renderHook(() => useFavourites(items, allVisible, { maxItems: 2 }));
    act(() => {
      result.current.recordUsage('a');
      result.current.recordUsage('b');
      result.current.recordUsage('c');
    });
    expect(result.current.favouriteItems.length).toBe(2);
  });

  it('becomes eligible for the tab once minToShowTab is reached', () => {
    const { result } = renderHook(() => useFavourites(items, allVisible, { minToShowTab: 2 }));
    act(() => result.current.recordUsage('a'));
    expect(result.current.isEligibleForTab).toBe(false);
    act(() => result.current.recordUsage('b'));
    expect(result.current.isEligibleForTab).toBe(true);
  });

  it('persists usage under the given storageNamespace, isolated from the default namespace', () => {
    const { result, unmount } = renderHook(() => useFavourites(items, allVisible, {}, 'admin-nav'));
    act(() => result.current.recordUsage('a'));
    unmount();

    const { result: defaultNs } = renderHook(() => useFavourites(items, allVisible));
    expect(defaultNs.current.favouriteItems).toEqual([]);

    const { result: namespaced } = renderHook(() => useFavourites(items, allVisible, {}, 'admin-nav'));
    expect(namespaced.current.favouriteItems.map((i) => i.id)).toEqual(['a']);
  });

  describe('pinning', () => {
    it('pinned items appear first, ahead of auto-ranked items', () => {
      const { result } = renderHook(() => useFavourites(items, allVisible));
      act(() => {
        result.current.recordUsage('b');
        result.current.recordUsage('b');
        result.current.pinItem('a');
      });
      expect(result.current.favouriteItems.map((i) => i.id)).toEqual(['a', 'b']);
    });

    it('isPinned reflects pin state, and unpinItem removes it', () => {
      const { result } = renderHook(() => useFavourites(items, allVisible));
      act(() => result.current.pinItem('a'));
      expect(result.current.isPinned('a')).toBe(true);

      act(() => result.current.unpinItem('a'));
      expect(result.current.isPinned('a')).toBe(false);
      expect(result.current.favouriteItems).toEqual([]);
    });

    it('a pinned item that becomes hidden is not shown', () => {
      const { result } = renderHook(() => useFavourites(items, allVisible));
      act(() => result.current.pinItem('hidden'));
      expect(result.current.favouriteItems).toEqual([]);
    });
  });
});
