import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import SidekickMenu from './SidekickMenu';
import { ISidekickMenuItem } from './types';

const deeplyNestedItems: ISidekickMenuItem[] = [
  {
    id: 'L1',
    label: 'Level 1',
    icon: '1',
    searchTerms: '',
    children: [
      {
        id: 'L2',
        label: 'Level 2',
        icon: '2',
        searchTerms: '',
        children: [
          {
            id: 'L3',
            label: 'Level 3',
            icon: '3',
            searchTerms: '',
            children: [
              {
                id: 'L4',
                label: 'Level 4',
                icon: '4',
                searchTerms: '',
                children: [
                  {
                    id: 'L5',
                    label: 'Level 5',
                    icon: '5',
                    searchTerms: '',
                    children: [
                      {
                        id: 'L6',
                        label: 'Level 6',
                        icon: '6',
                        searchTerms: '',
                        path: '/final'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

describe('SidekickMenu Infinite Nesting', () => {
  it('should render and expand a menu nested 6 levels deep', () => {
    render(<SidekickMenu items={deeplyNestedItems} />);
    
    // Open the menu
    const hamburger = screen.getByRole('button');
    fireEvent.click(hamburger);

    // Recursively expand and verify
    fireEvent.click(screen.getByText('Level 1'));
    expect(screen.getByText('Level 2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Level 2'));
    expect(screen.getByText('Level 3')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Level 3'));
    expect(screen.getByText('Level 4')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Level 4'));
    expect(screen.getByText('Level 5')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Level 5'));
    expect(screen.getByText('Level 6')).toBeInTheDocument();
  });

  it('should maintain a single global highlight index across all nesting levels', () => {
    const { container } = render(<SidekickMenu items={deeplyNestedItems} />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button'));

    // Expand all levels
    fireEvent.click(screen.getByText('Level 1'));
    fireEvent.click(screen.getByText('Level 2'));
    fireEvent.click(screen.getByText('Level 3'));
    fireEvent.click(screen.getByText('Level 4'));
    fireEvent.click(screen.getByText('Level 5'));

    // Move down 4 times (Level 1 -> Level 2 -> Level 3 -> Level 4)
    const navRoot = container.firstChild as HTMLElement;
    fireEvent.keyDown(navRoot, { key: 'ArrowDown' }); // L1
    fireEvent.keyDown(navRoot, { key: 'ArrowDown' }); // L2
    fireEvent.keyDown(navRoot, { key: 'ArrowDown' }); // L3
    fireEvent.keyDown(navRoot, { key: 'ArrowDown' }); // L4
    
    // Verify that exactly ONE item is highlighted globally
    // Before the fix, 6 items would have been highlighted because each level reset the index.
    const highlightedItems = container.querySelectorAll('[data-highlighted="true"]');
    expect(highlightedItems.length).toBe(1);
    expect(highlightedItems[0]).toHaveTextContent('Level 4');
  });

  it('should correctly search and filter items across deep nesting levels', () => {
    render(<SidekickMenu items={deeplyNestedItems} alwaysShowUnsearchableItems={false} />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button'));

    // Search for "Level 6"
    const searchInput = screen.getByPlaceholderText('Search menu...');
    fireEvent.change(searchInput, { target: { value: 'Level 6' } });

    // Verify L1 to L6 are in the document (since L6 is a match, its parents must be shown)
    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('Level 2')).toBeInTheDocument();
    expect(screen.getByText('Level 3')).toBeInTheDocument();
    expect(screen.getByText('Level 4')).toBeInTheDocument();
    expect(screen.getByText('Level 5')).toBeInTheDocument();
    expect(screen.getByText('Level 6')).toBeInTheDocument();

    // Search for something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });
    expect(screen.queryByText('Level 1')).not.toBeInTheDocument();
  });
});
