import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import MenuBreadcrumb from './MenuBreadcrumb';
import { ISidekickMenuItem } from '../types';

const path: ISidekickMenuItem[] = [
  { id: 'settings', label: 'Settings', icon: '', searchTerms: '', children: [] },
  { id: 'billing', label: 'Billing', icon: '', searchTerms: '', children: [] },
];

describe('MenuBreadcrumb', () => {
  it('renders nothing at the root (empty path)', () => {
    const { container } = render(<MenuBreadcrumb path={[]} onNavigate={jest.fn()} onBack={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a clickable crumb for every ancestor and a non-clickable current crumb for the last one', () => {
    render(<MenuBreadcrumb path={path} onNavigate={jest.fn()} onBack={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Billing' })).not.toBeInTheDocument();
  });

  it('clicking an ancestor crumb calls onNavigate with its index', () => {
    const onNavigate = jest.fn();
    render(<MenuBreadcrumb path={path} onNavigate={onNavigate} onBack={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it('clicking the root/home crumb calls onNavigate with -1', () => {
    const onNavigate = jest.fn();
    render(<MenuBreadcrumb path={path} onNavigate={onNavigate} onBack={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(onNavigate).toHaveBeenCalledWith(-1);
  });

  it('clicking the back button calls onBack', () => {
    const onBack = jest.fn();
    render(<MenuBreadcrumb path={path} onNavigate={jest.fn()} onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(onBack).toHaveBeenCalled();
  });
});
