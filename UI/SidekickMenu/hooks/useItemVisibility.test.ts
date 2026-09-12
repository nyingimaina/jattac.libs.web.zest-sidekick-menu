import { renderHook, waitFor } from '@testing-library/react';
import { useItemVisibility } from './useItemVisibility';
import { getStorageKey } from '../utils/namespace';
import { ISidekickMenuItem } from '../types';

describe('useItemVisibility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('marks items without a visibilityControl as VISIBLE immediately (baseline behavior)', () => {
    const items: ISidekickMenuItem[] = [
      { id: 'a', label: 'A', icon: '', searchTerms: '', path: '/a' },
    ];
    const { result } = renderHook(() => useItemVisibility(items));
    expect(result.current.a).toBe('VISIBLE');
  });

  it('reads cached visibility from the legacy unnamespaced key by default', async () => {
    localStorage.setItem(
      getStorageKey('visibilityCache'),
      JSON.stringify({ a: { visible: false, expires: Date.now() + 100000 } })
    );
    const items: ISidekickMenuItem[] = [
      {
        id: 'a',
        label: 'A',
        icon: '',
        searchTerms: '',
        path: '/a',
        visibilityControl: { isVisibleResolver: true, isCachable: true },
      },
    ];
    const { result } = renderHook(() => useItemVisibility(items));
    await waitFor(() => expect(result.current.a).toBe('HIDDEN'));
  });

  it('reads cached visibility from a namespaced key when storageNamespace is provided', async () => {
    localStorage.setItem(
      getStorageKey('visibilityCache', 'admin-nav'),
      JSON.stringify({ a: { visible: false, expires: Date.now() + 100000 } })
    );
    const items: ISidekickMenuItem[] = [
      {
        id: 'a',
        label: 'A',
        icon: '',
        searchTerms: '',
        path: '/a',
        visibilityControl: { isVisibleResolver: true, isCachable: true },
      },
    ];
    const { result } = renderHook(() => useItemVisibility(items, 24, 'admin-nav'));
    await waitFor(() => expect(result.current.a).toBe('HIDDEN'));
  });
});
