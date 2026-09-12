import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import DrilldownMenuList from './DrilldownMenuList';
import { ISidekickMenuItem } from '../types';

const items: ISidekickMenuItem[] = [
  { id: 'parent', label: 'Parent', icon: '', searchTerms: '', children: [] },
  { id: 'leaf1', label: 'Leaf One', icon: '', searchTerms: '', path: '/1' },
  { id: 'leaf2', label: 'Leaf Two', icon: '', searchTerms: '', path: '/2' },
];

const allVisible = { parent: 'VISIBLE', leaf1: 'VISIBLE', leaf2: 'VISIBLE' } as const;

describe('DrilldownMenuList number badges', () => {
  it('never assigns a number badge to a parent (non-leaf) item', () => {
    render(
      <DrilldownMenuList
        items={items}
        itemVisibility={allVisible}
        searchTerm=""
        alwaysShowUnsearchableItems
        highlightedIndex={-1}
        onDrillIn={jest.fn()}
        onActivate={jest.fn()}
        showNumberBadges
      />
    );
    const parentRow = screen.getByText('Parent').closest('li')!;
    expect(parentRow.textContent).not.toMatch(/[0-9]/);
  });

  it('numbers leaf items sequentially among themselves, skipping the parent (matching keyboard-eligible order)', () => {
    render(
      <DrilldownMenuList
        items={items}
        itemVisibility={allVisible}
        searchTerm=""
        alwaysShowUnsearchableItems
        highlightedIndex={-1}
        onDrillIn={jest.fn()}
        onActivate={jest.fn()}
        showNumberBadges
      />
    );
    const leaf1Row = screen.getByText('Leaf One').closest('li')!;
    const leaf2Row = screen.getByText('Leaf Two').closest('li')!;
    expect(leaf1Row).toHaveTextContent('1');
    expect(leaf2Row).toHaveTextContent('2');
  });

  it('shows no badges at all when showNumberBadges is false', () => {
    render(
      <DrilldownMenuList
        items={items}
        itemVisibility={allVisible}
        searchTerm=""
        alwaysShowUnsearchableItems
        highlightedIndex={-1}
        onDrillIn={jest.fn()}
        onActivate={jest.fn()}
        showNumberBadges={false}
      />
    );
    expect(screen.getByText('Leaf One').closest('li')).not.toHaveTextContent('1');
  });
});

describe('DrilldownMenuList pinning from the main browsing view', () => {
  it('shows a pin toggle on a leaf item when isPinned/onTogglePin are provided, even with no usage history', () => {
    render(
      <DrilldownMenuList
        items={items}
        itemVisibility={allVisible}
        searchTerm=""
        alwaysShowUnsearchableItems
        highlightedIndex={-1}
        onDrillIn={jest.fn()}
        onActivate={jest.fn()}
        isPinned={() => false}
        onTogglePin={jest.fn()}
      />
    );
    const leaf1Row = screen.getByText('Leaf One').closest('li')!;
    expect(leaf1Row.querySelector('button[aria-label*="Pin"]')).not.toBeNull();
  });

  it('never shows a pin toggle on a parent (non-leaf) item', () => {
    render(
      <DrilldownMenuList
        items={items}
        itemVisibility={allVisible}
        searchTerm=""
        alwaysShowUnsearchableItems
        highlightedIndex={-1}
        onDrillIn={jest.fn()}
        onActivate={jest.fn()}
        isPinned={() => false}
        onTogglePin={jest.fn()}
      />
    );
    const parentRow = screen.getByText('Parent').closest('li')!;
    expect(parentRow.querySelector('button')).toBeNull();
  });

  it('clicking the pin toggle calls onTogglePin without also drilling in or activating', () => {
    const onTogglePin = jest.fn();
    const onActivate = jest.fn();
    render(
      <DrilldownMenuList
        items={items}
        itemVisibility={allVisible}
        searchTerm=""
        alwaysShowUnsearchableItems
        highlightedIndex={-1}
        onDrillIn={jest.fn()}
        onActivate={onActivate}
        isPinned={() => false}
        onTogglePin={onTogglePin}
      />
    );
    const leaf1Row = screen.getByText('Leaf One').closest('li')!;
    fireEvent.click(leaf1Row.querySelector('button[aria-label*="Pin"]')!);
    expect(onTogglePin).toHaveBeenCalledWith('leaf1');
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('does not show a pin toggle at all when isPinned/onTogglePin are not provided (favouritesEnabled off)', () => {
    render(
      <DrilldownMenuList
        items={items}
        itemVisibility={allVisible}
        searchTerm=""
        alwaysShowUnsearchableItems
        highlightedIndex={-1}
        onDrillIn={jest.fn()}
        onActivate={jest.fn()}
      />
    );
    expect(screen.getByText('Leaf One').closest('li')!.querySelector('button')).toBeNull();
  });
});
