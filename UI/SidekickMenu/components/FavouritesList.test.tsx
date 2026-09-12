import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import FavouritesList from './FavouritesList';
import { ISidekickMenuItem } from '../types';

const allItems: ISidekickMenuItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: '',
    searchTerms: '',
    children: [
      {
        id: 'billing',
        label: 'Billing',
        icon: '',
        searchTerms: '',
        path: '/settings/billing',
        description: 'Manage your plan',
      },
      { id: 'profile', label: 'Profile', icon: '', searchTerms: '', path: '/settings/profile' },
    ],
  },
];

const billing = allItems[0].children![0];
const profile = allItems[0].children![1];

describe('FavouritesList', () => {
  it('shows an empty-state message when there are no favourites yet', () => {
    render(
      <FavouritesList
        favouriteItems={[]}
        allItems={allItems}
        highlightedIndex={-1}
        onActivate={jest.fn()}
        isPinned={() => false}
        onTogglePin={jest.fn()}
      />
    );
    expect(screen.getByText(/will appear here/i)).toBeInTheDocument();
  });

  it('shows the item description as secondary text when present', () => {
    render(
      <FavouritesList
        favouriteItems={[billing]}
        allItems={allItems}
        highlightedIndex={-1}
        onActivate={jest.fn()}
        isPinned={() => false}
        onTogglePin={jest.fn()}
      />
    );
    expect(screen.getByText('Manage your plan')).toBeInTheDocument();
  });

  it('falls back to a breadcrumb path as secondary text when no description is set', () => {
    render(
      <FavouritesList
        favouriteItems={[profile]}
        allItems={allItems}
        highlightedIndex={-1}
        onActivate={jest.fn()}
        isPinned={() => false}
        onTogglePin={jest.fn()}
      />
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('clicking an item calls onActivate with it', () => {
    const onActivate = jest.fn();
    render(
      <FavouritesList
        favouriteItems={[billing]}
        allItems={allItems}
        highlightedIndex={-1}
        onActivate={onActivate}
        isPinned={() => false}
        onTogglePin={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText('Billing'));
    expect(onActivate).toHaveBeenCalledWith(billing);
  });

  it('reflects pin state and forwards pin toggles', () => {
    const onTogglePin = jest.fn();
    render(
      <FavouritesList
        favouriteItems={[billing]}
        allItems={allItems}
        highlightedIndex={-1}
        onActivate={jest.fn()}
        isPinned={(id) => id === 'billing'}
        onTogglePin={onTogglePin}
      />
    );
    const pinButton = screen.getByRole('button', { name: /unpin/i });
    fireEvent.click(pinButton);
    expect(onTogglePin).toHaveBeenCalledWith('billing');
  });

  it('only assigns a number badge to a pinned item, never to an auto-ranked one', () => {
    render(
      <FavouritesList
        favouriteItems={[billing, profile]}
        allItems={allItems}
        highlightedIndex={-1}
        onActivate={jest.fn()}
        isPinned={(id) => id === 'billing'}
        onTogglePin={jest.fn()}
        showNumberBadges
      />
    );
    expect(screen.getByText('Billing').closest('li')).toHaveTextContent('1');
    expect(screen.getByText('Profile').closest('li')?.textContent).not.toMatch(/[0-9]/);
  });
});
