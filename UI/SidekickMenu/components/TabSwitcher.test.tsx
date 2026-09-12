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
});
