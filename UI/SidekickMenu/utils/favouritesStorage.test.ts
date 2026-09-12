import { readUsageStats, writeUsageStats, recordUsageTimestamp, clearSidekickMenuUsageStats } from './favouritesStorage';
import { getStorageKey } from './namespace';

describe('readUsageStats / writeUsageStats', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty document when nothing is stored yet', () => {
    expect(readUsageStats()).toEqual({ usage: {}, pinned: [] });
  });

  it('returns an empty document when the stored JSON is corrupt', () => {
    localStorage.setItem(getStorageKey('usageStats'), '{not json');
    expect(readUsageStats()).toEqual({ usage: {}, pinned: [] });
  });

  it('round-trips a document through the legacy unnamespaced key', () => {
    const doc = { usage: { a: [1, 2, 3] }, pinned: ['a'] };
    writeUsageStats(doc);
    expect(readUsageStats()).toEqual(doc);
  });

  it('round-trips a document through a namespaced key, independent of the default key', () => {
    const doc = { usage: { a: [1] }, pinned: [] };
    writeUsageStats(doc, 'admin-nav');
    expect(readUsageStats('admin-nav')).toEqual(doc);
    expect(readUsageStats()).toEqual({ usage: {}, pinned: [] });
  });
});

describe('clearSidekickMenuUsageStats', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('clears the default (unnamespaced) usage stats', () => {
    writeUsageStats({ usage: { a: [1] }, pinned: ['a'] });
    clearSidekickMenuUsageStats();
    expect(readUsageStats()).toEqual({ usage: {}, pinned: [] });
  });

  it('clears only the given namespace, leaving others untouched', () => {
    writeUsageStats({ usage: { a: [1] }, pinned: [] });
    writeUsageStats({ usage: { b: [1] }, pinned: [] }, 'admin-nav');

    clearSidekickMenuUsageStats('admin-nav');

    expect(readUsageStats('admin-nav')).toEqual({ usage: {}, pinned: [] });
    expect(readUsageStats()).toEqual({ usage: { a: [1] }, pinned: [] });
  });
});

describe('recordUsageTimestamp', () => {
  it('appends a timestamp for a previously-unused item', () => {
    const doc = { usage: {}, pinned: [] };
    const updated = recordUsageTimestamp(doc, 'a', 1000);
    expect(updated.usage.a).toEqual([1000]);
  });

  it('appends to an existing item\'s timestamp history', () => {
    const doc = { usage: { a: [500] }, pinned: [] };
    const updated = recordUsageTimestamp(doc, 'a', 1000);
    expect(updated.usage.a).toEqual([500, 1000]);
  });

  it('caps the timestamp history at 20 entries, dropping the oldest', () => {
    const existing = Array.from({ length: 20 }, (_, i) => i);
    const doc = { usage: { a: existing }, pinned: [] };
    const updated = recordUsageTimestamp(doc, 'a', 999);
    expect(updated.usage.a.length).toBe(20);
    expect(updated.usage.a[0]).toBe(1); // oldest (0) dropped
    expect(updated.usage.a[19]).toBe(999);
  });

  it('does not mutate the original document', () => {
    const doc = { usage: { a: [1] }, pinned: [] };
    recordUsageTimestamp(doc, 'a', 2);
    expect(doc.usage.a).toEqual([1]);
  });
});
