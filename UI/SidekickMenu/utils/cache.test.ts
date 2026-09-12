import { clearSidekickMenuCache } from './cache';
import { getStorageKey } from './namespace';

describe('clearSidekickMenuCache', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('clears the legacy unnamespaced visibility cache key by default (baseline/back-compat behavior)', () => {
    localStorage.setItem('sidekickMenuVisibilityCache', '{"x":1}');
    clearSidekickMenuCache();
    expect(localStorage.getItem('sidekickMenuVisibilityCache')).toBeNull();
  });

  it('clears the namespaced key when a storageNamespace is provided', () => {
    const key = getStorageKey('visibilityCache', 'admin-nav');
    localStorage.setItem(key, '{"x":1}');
    clearSidekickMenuCache('admin-nav');
    expect(localStorage.getItem(key)).toBeNull();
  });

  it('does not clear a different namespace\'s cache', () => {
    localStorage.setItem('sidekickMenuVisibilityCache', '{"legacy":1}');
    const nsKey = getStorageKey('visibilityCache', 'admin-nav');
    localStorage.setItem(nsKey, '{"ns":1}');

    clearSidekickMenuCache('admin-nav');

    expect(localStorage.getItem(nsKey)).toBeNull();
    expect(localStorage.getItem('sidekickMenuVisibilityCache')).not.toBeNull();
  });
});
