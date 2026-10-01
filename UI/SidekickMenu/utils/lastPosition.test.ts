import { ISidekickMenuItem } from '../types';
import { findItemForLocation, getValidPathPrefix, locationKey, resolveOpenPosition } from './lastPosition';

const items: ISidekickMenuItem[] = [
  { id: 'home', label: 'Home', icon: '', searchTerms: '', path: '/' },
  {
    id: 'sales',
    label: 'Sales',
    icon: '',
    searchTerms: '',
    children: [
      { id: 'orders', label: 'Orders', icon: '', searchTerms: '', path: '/orders' },
      { id: 'order-new', label: 'New order', icon: '', searchTerms: '', path: '/orders/new' },
      { id: 'refunds', label: 'Refunds', icon: '', searchTerms: '', path: '#/refunds' },
    ],
  },
  { id: 'external', label: 'Docs', icon: '', searchTerms: '', path: 'https://example.com/orders' },
];

const visible = {};

describe('locationKey', () => {
  it('normalises trailing slashes, drops the query string, and keeps hash routes', () => {
    expect(locationKey('/orders/?page=2')).toBe('/orders');
    expect(locationKey('/app/#/refunds/')).toBe('/app#/refunds');
    expect(locationKey('/orders#section')).toBe('/orders');
  });

  it('returns null for other origins', () => {
    expect(locationKey('https://example.com/orders')).toBeNull();
  });
});

describe('findItemForLocation', () => {
  it('prefers an exact match over a prefix match', () => {
    expect(findItemForLocation(items, '/orders/new', visible)?.id).toBe('order-new');
  });

  it('falls back to the longest whole-segment prefix', () => {
    expect(findItemForLocation(items, '/orders/42/edit', visible)?.id).toBe('orders');
    expect(findItemForLocation(items, '/ordersx', visible)).toBeNull();
  });

  it('only matches "/" exactly', () => {
    expect(findItemForLocation(items, '/', visible)?.id).toBe('home');
    expect(findItemForLocation(items, '/unknown', visible)).toBeNull();
  });

  it('matches hash routes and ignores other origins', () => {
    expect(findItemForLocation(items, '/#/refunds', visible)?.id).toBe('refunds');
  });

  it('skips hidden items and items inside hidden sections', () => {
    expect(findItemForLocation(items, '/orders', { sales: 'HIDDEN' })).toBeNull();
  });
});

describe('resolveOpenPosition', () => {
  const stored = { path: ['sales'], itemId: 'order-new', url: '/orders/new' };

  it('uses the stored position while the user is still on the page it led to', () => {
    expect(resolveOpenPosition(items, stored, '/orders/new', visible)).toBe(stored);
  });

  it('uses the item matching the URL once the user has moved elsewhere', () => {
    expect(resolveOpenPosition(items, stored, '/orders/7', visible)).toEqual({ path: ['sales'], itemId: 'orders' });
  });

  it('falls back to the stored position on a page the menu does not know', () => {
    expect(resolveOpenPosition(items, stored, '/somewhere-else', visible)).toBe(stored);
  });

  it('uses the URL match when nothing is stored', () => {
    expect(resolveOpenPosition(items, null, '/orders', visible)).toEqual({ path: ['sales'], itemId: 'orders' });
    expect(resolveOpenPosition(items, null, '/nope', visible)).toBeNull();
  });
});

describe('getValidPathPrefix', () => {
  it('truncates at the first missing or hidden section', () => {
    expect(getValidPathPrefix(items, ['sales', 'gone'], visible)).toEqual(['sales']);
    expect(getValidPathPrefix(items, ['sales'], { sales: 'HIDDEN' })).toEqual([]);
  });

  it('with requireNonEmpty, rejects a section whose children are all hidden', () => {
    const allHidden = { orders: 'HIDDEN', 'order-new': 'HIDDEN', refunds: 'HIDDEN' } as const;
    expect(getValidPathPrefix(items, ['sales'], allHidden)).toEqual(['sales']);
    expect(getValidPathPrefix(items, ['sales'], allHidden, true)).toEqual([]);
  });
});
