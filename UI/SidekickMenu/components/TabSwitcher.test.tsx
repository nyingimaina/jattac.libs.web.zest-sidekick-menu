import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import TabSwitcher from './TabSwitcher';

describe('TabSwitcher', () => {
  it('marks the active tab as selected', () => {
    render(<TabSwitcher activeTab="favourites" onChange={jest.fn()} />);
    expect(screen.getByRole('tab', { name: 'Favourites' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange with the clicked tab', () => {
    const onChange = jest.fn();
    render(<TabSwitcher activeTab="favourites" onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'All' }));
    expect(onChange).toHaveBeenCalledWith('all');
  });

  it('shows a star icon (filled when active) on Favourites and a grid icon on All', () => {
    const { rerender } = render(<TabSwitcher activeTab="favourites" onChange={jest.fn()} />);
    const starPath = () => screen.getByRole('tab', { name: 'Favourites' }).querySelector('svg')!;
    expect(starPath()).toHaveAttribute('fill', 'currentColor');
    expect(screen.getByRole('tab', { name: 'All' }).querySelectorAll('svg rect')).toHaveLength(4);

    rerender(<TabSwitcher activeTab="all" onChange={jest.fn()} />);
    expect(starPath()).toHaveAttribute('fill', 'none');
  });

  it('exposes the active tab for the sliding indicator, and only enables icon animation after a switch', () => {
    const { container } = render(<TabSwitcher activeTab="all" onChange={jest.fn()} />);
    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('data-active-tab', 'all');
    expect(tablist).not.toHaveAttribute('data-animate');

    fireEvent.click(screen.getByRole('tab', { name: 'All' })); // already active: no animation
    expect(tablist).not.toHaveAttribute('data-animate');

    fireEvent.click(screen.getByRole('tab', { name: 'Favourites' }));
    expect(tablist).toHaveAttribute('data-animate', 'true');
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
