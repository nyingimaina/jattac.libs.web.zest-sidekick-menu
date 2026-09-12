import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import DrilldownMenuItem from './DrilldownMenuItem';
import { ISidekickMenuItem } from '../types';

const leaf: ISidekickMenuItem = {
  id: 'leaf',
  label: 'Leaf Item',
  icon: '',
  searchTerms: '',
  path: '/leaf',
  description: 'A short helpful hint',
};

const parent: ISidekickMenuItem = {
  id: 'parent',
  label: 'Parent Item',
  icon: '',
  searchTerms: '',
  children: [],
};

describe('DrilldownMenuItem', () => {
  it('calls onActivate (not onDrillIn) when clicking a leaf item', () => {
    const onActivate = jest.fn();
    const onDrillIn = jest.fn();
    render(<DrilldownMenuItem item={leaf} highlighted={false} onActivate={onActivate} onDrillIn={onDrillIn} />);
    fireEvent.click(screen.getByText('Leaf Item'));
    expect(onActivate).toHaveBeenCalledWith(leaf);
    expect(onDrillIn).not.toHaveBeenCalled();
  });

  it('calls onDrillIn (not onActivate) when clicking a parent item', () => {
    const onActivate = jest.fn();
    const onDrillIn = jest.fn();
    render(<DrilldownMenuItem item={parent} highlighted={false} onActivate={onActivate} onDrillIn={onDrillIn} />);
    fireEvent.click(screen.getByText('Parent Item'));
    expect(onDrillIn).toHaveBeenCalledWith('parent');
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('renders a chevron for a parent item but not a leaf item', () => {
    const { rerender } = render(
      <DrilldownMenuItem item={parent} highlighted={false} onActivate={jest.fn()} onDrillIn={jest.fn()} />
    );
    expect(screen.getByText('▶')).toBeInTheDocument();

    rerender(<DrilldownMenuItem item={leaf} highlighted={false} onActivate={jest.fn()} onDrillIn={jest.fn()} />);
    expect(screen.queryByText('▶')).not.toBeInTheDocument();
  });

  it('uses the (truncated) description as the title tooltip', () => {
    const longDescription = 'This description is definitely longer than forty characters';
    const itemWithLongDescription = { ...leaf, description: longDescription };
    render(
      <DrilldownMenuItem item={itemWithLongDescription} highlighted={false} onActivate={jest.fn()} onDrillIn={jest.fn()} />
    );
    const li = screen.getByText('Leaf Item').closest('li')!;
    expect(li.getAttribute('title')!.length).toBe(40);
    expect(li.getAttribute('title')).toMatch(/…$/);
  });

  it('shows a pin toggle when onTogglePin is provided, and calls it without triggering onActivate', () => {
    const onActivate = jest.fn();
    const onTogglePin = jest.fn();
    render(
      <DrilldownMenuItem
        item={leaf}
        highlighted={false}
        onActivate={onActivate}
        onDrillIn={jest.fn()}
        onTogglePin={onTogglePin}
        isPinned={false}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /pin/i }));
    expect(onTogglePin).toHaveBeenCalledWith('leaf');
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('does not render a pin toggle when onTogglePin is not provided', () => {
    render(<DrilldownMenuItem item={leaf} highlighted={false} onActivate={jest.fn()} onDrillIn={jest.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a number badge when provided', () => {
    render(
      <DrilldownMenuItem item={leaf} highlighted={false} onActivate={jest.fn()} onDrillIn={jest.fn()} numberBadge={3} />
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders secondary text (e.g. a breadcrumb fallback) when provided', () => {
    render(
      <DrilldownMenuItem
        item={{ ...leaf, description: undefined }}
        highlighted={false}
        onActivate={jest.fn()}
        onDrillIn={jest.fn()}
        secondaryText="Settings › Billing"
      />
    );
    expect(screen.getByText('Settings › Billing')).toBeInTheDocument();
  });
});
