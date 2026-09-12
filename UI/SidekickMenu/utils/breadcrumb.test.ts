import { findItemById, getBreadcrumbPath } from './breadcrumb';
import { ISidekickMenuItem } from '../types';

const tree: ISidekickMenuItem[] = [
  { id: 'home', label: 'Home', icon: '', searchTerms: '', path: '/home' },
  {
    id: 'settings',
    label: 'Settings',
    icon: '',
    searchTerms: '',
    children: [
      { id: 'profile', label: 'Profile', icon: '', searchTerms: '', path: '/settings/profile' },
      {
        id: 'billing',
        label: 'Billing',
        icon: '',
        searchTerms: '',
        children: [
          { id: 'invoices', label: 'Invoices', icon: '', searchTerms: '', path: '/settings/billing/invoices' },
        ],
      },
    ],
  },
];

describe('findItemById', () => {
  it('finds a top-level item', () => {
    expect(findItemById(tree, 'home')?.label).toBe('Home');
  });

  it('finds a deeply nested item', () => {
    expect(findItemById(tree, 'invoices')?.label).toBe('Invoices');
  });

  it('returns undefined for an id that does not exist', () => {
    expect(findItemById(tree, 'nope')).toBeUndefined();
  });
});

describe('getBreadcrumbPath', () => {
  it('returns an empty array for a top-level item', () => {
    expect(getBreadcrumbPath(tree, 'home')).toEqual([]);
  });

  it('returns the chain of ancestors (not including the target itself) for a nested item', () => {
    const path = getBreadcrumbPath(tree, 'invoices');
    expect(path.map((i) => i.id)).toEqual(['settings', 'billing']);
  });

  it('returns an empty array when the id does not exist', () => {
    expect(getBreadcrumbPath(tree, 'nope')).toEqual([]);
  });
});
