import { getStorageKey, registerNamespaceUsage, __resetNamespaceRegistryForTests } from './namespace';

describe('getStorageKey', () => {
  it('returns the legacy unnamespaced key for visibilityCache when no storageNamespace is given', () => {
    expect(getStorageKey('visibilityCache')).toBe('sidekickMenuVisibilityCache');
  });

  it('returns a default unnamespaced key for usageStats when no storageNamespace is given', () => {
    expect(getStorageKey('usageStats')).toBe('sidekickMenuUsageStats');
  });

  it('returns a namespaced key for both kinds when storageNamespace is given', () => {
    expect(getStorageKey('visibilityCache', 'admin-nav')).toBe('sidekickMenu:admin-nav:visibilityCache');
    expect(getStorageKey('usageStats', 'admin-nav')).toBe('sidekickMenu:admin-nav:usageStats');
  });
});

describe('registerNamespaceUsage (dev-mode collision detector)', () => {
  const originalEnv = process.env.NODE_ENV;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    __resetNamespaceRegistryForTests();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it('does not warn for a single registered instance', () => {
    process.env.NODE_ENV = 'development';
    const itemsA = [{ id: 'a' }];
    const unregister = registerNamespaceUsage('sidekickMenuUsageStats', itemsA);
    expect(warnSpy).not.toHaveBeenCalled();
    unregister();
  });

  it('warns when two instances share a namespace with different item references', () => {
    process.env.NODE_ENV = 'development';
    const itemsA = [{ id: 'a' }];
    const itemsB = [{ id: 'b' }];
    registerNamespaceUsage('sidekickMenuUsageStats', itemsA);
    registerNamespaceUsage('sidekickMenuUsageStats', itemsB);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/storageNamespace/i);
  });

  it('does not warn when two instances share a namespace with the same item reference', () => {
    process.env.NODE_ENV = 'development';
    const items = [{ id: 'a' }];
    registerNamespaceUsage('sidekickMenuUsageStats', items);
    registerNamespaceUsage('sidekickMenuUsageStats', items);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('does not warn when instances resolve to different namespaces', () => {
    process.env.NODE_ENV = 'development';
    registerNamespaceUsage('sidekickMenu:a:usageStats', [{ id: 'a' }]);
    registerNamespaceUsage('sidekickMenu:b:usageStats', [{ id: 'b' }]);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('does not warn in production even when there is a real collision', () => {
    process.env.NODE_ENV = 'production';
    registerNamespaceUsage('sidekickMenuUsageStats', [{ id: 'a' }]);
    registerNamespaceUsage('sidekickMenuUsageStats', [{ id: 'b' }]);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('unregistering removes the instance so a later distinct instance does not warn', () => {
    process.env.NODE_ENV = 'development';
    const itemsA = [{ id: 'a' }];
    const itemsB = [{ id: 'b' }];
    const unregister = registerNamespaceUsage('sidekickMenuUsageStats', itemsA);
    unregister();
    registerNamespaceUsage('sidekickMenuUsageStats', itemsB);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
