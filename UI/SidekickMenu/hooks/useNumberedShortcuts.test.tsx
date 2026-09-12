import { render, act } from '@testing-library/react';
import React, { useRef } from 'react';
import { useNumberedShortcuts } from './useNumberedShortcuts';
import { ISidekickMenuItem } from '../types';

const items: ISidekickMenuItem[] = [
  { id: 'a', label: 'A', icon: '', searchTerms: '', path: '/a' },
  { id: 'b', label: 'B', icon: '', searchTerms: '', path: '/b' },
];

// A small harness so the hook's menuRef points at a real, focusable DOM node.
const Harness: React.FC<{ enabled: boolean; onActivate: (item: ISidekickMenuItem) => void }> = ({
  enabled,
  onActivate,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { showBadges } = useNumberedShortcuts({ enabled, menuRef, eligibleItems: items, onActivate });
  return (
    <div ref={menuRef} data-testid="menu">
      <input data-testid="focusable" />
      <span data-testid="badges">{showBadges ? 'shown' : 'hidden'}</span>
    </div>
  );
};

describe('useNumberedShortcuts', () => {
  it('badges are hidden until a keydown has been observed within the panel', () => {
    const { getByTestId } = render(<Harness enabled onActivate={jest.fn()} />);
    expect(getByTestId('badges').textContent).toBe('hidden');
  });

  it('activates the eligible item at the pressed digit position when focus is inside the panel', () => {
    const onActivate = jest.fn();
    const { getByTestId } = render(<Harness enabled onActivate={onActivate} />);
    const focusable = getByTestId('focusable');
    focusable.focus();

    act(() => {
      focusable.dispatchEvent(new KeyboardEvent('keydown', { code: 'Digit2', bubbles: true }));
    });

    expect(onActivate).toHaveBeenCalledWith(items[1]);
  });

  it('shows badges after a real keydown is observed within the panel', () => {
    const { getByTestId } = render(<Harness enabled onActivate={jest.fn()} />);
    const focusable = getByTestId('focusable');
    focusable.focus();

    act(() => {
      focusable.dispatchEvent(new KeyboardEvent('keydown', { code: 'Digit1', bubbles: true }));
    });

    expect(getByTestId('badges').textContent).toBe('shown');
  });

  it('does nothing when focus is outside the panel', () => {
    const onActivate = jest.fn();
    render(<Harness enabled onActivate={onActivate} />);
    const outside = document.createElement('input');
    document.body.appendChild(outside);
    outside.focus();

    act(() => {
      outside.dispatchEvent(new KeyboardEvent('keydown', { code: 'Digit1', bubbles: true }));
    });

    expect(onActivate).not.toHaveBeenCalled();
    document.body.removeChild(outside);
  });

  it('does nothing when disabled', () => {
    const onActivate = jest.fn();
    const { getByTestId } = render(<Harness enabled={false} onActivate={onActivate} />);
    const focusable = getByTestId('focusable');
    focusable.focus();

    act(() => {
      focusable.dispatchEvent(new KeyboardEvent('keydown', { code: 'Digit1', bubbles: true }));
    });

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('ignores a digit beyond the number of eligible items', () => {
    const onActivate = jest.fn();
    const { getByTestId } = render(<Harness enabled onActivate={onActivate} />);
    const focusable = getByTestId('focusable');
    focusable.focus();

    act(() => {
      focusable.dispatchEvent(new KeyboardEvent('keydown', { code: 'Digit9', bubbles: true }));
    });

    expect(onActivate).not.toHaveBeenCalled();
  });
});
