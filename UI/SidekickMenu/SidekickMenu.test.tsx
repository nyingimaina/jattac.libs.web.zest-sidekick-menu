import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import SidekickMenu from './SidekickMenu';
import { ISidekickMenuItem } from './types';
import ZestSidekickConfigProvider from '../context/ZestSidekickConfigProvider';

const simpleItems: ISidekickMenuItem[] = [
  { id: 'home', label: 'Home', icon: 'H', searchTerms: '', path: '/home' },
];

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

describe('SidekickMenu Infinite Nesting (legacy accordion mode)', () => {
  it('should render and expand a menu nested 6 levels deep', () => {
    render(<SidekickMenu items={deeplyNestedItems} navigationStyle="accordion" />);
    
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
    const { container } = render(<SidekickMenu items={deeplyNestedItems} navigationStyle="accordion" />);
    
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
    render(<SidekickMenu items={deeplyNestedItems} alwaysShowUnsearchableItems={false} navigationStyle="accordion" />);
    
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

describe('SidekickMenu theming', () => {
  const setSystemPrefersDark = (matches: boolean) => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  };

  it('defaults to data-theme="light" when the OS prefers light and no theme prop is set', () => {
    setSystemPrefersDark(false);
    const { container } = render(<SidekickMenu items={simpleItems} />);
    expect(container.firstChild).toHaveAttribute('data-theme', 'light');
  });

  it('defaults to data-theme="dark" when the OS prefers dark and no theme prop is set', () => {
    setSystemPrefersDark(true);
    const { container } = render(<SidekickMenu items={simpleItems} />);
    expect(container.firstChild).toHaveAttribute('data-theme', 'dark');
  });

  it('an explicit zest.theme overrides the OS preference', () => {
    setSystemPrefersDark(false);
    const { container } = render(
      <SidekickMenu items={simpleItems} zest={{ theme: 'dark' }} />
    );
    expect(container.firstChild).toHaveAttribute('data-theme', 'dark');
  });

  it('defaults to data-motion="playful" when no motion options are set', () => {
    const { container } = render(<SidekickMenu items={simpleItems} />);
    expect(container.firstChild).toHaveAttribute('data-motion', 'playful');
  });

  it('a local zest.motionOptions.intensity overrides the default', () => {
    const { container } = render(
      <SidekickMenu items={simpleItems} zest={{ motionOptions: { intensity: 'subtle' } }} />
    );
    expect(container.firstChild).toHaveAttribute('data-motion', 'subtle');
  });

  it('a global ZestSidekickConfigProvider default is used when no local zest prop is set', () => {
    const { container } = render(
      <ZestSidekickConfigProvider config={{ defaultProps: { theme: 'dark' } }}>
        <SidekickMenu items={simpleItems} />
      </ZestSidekickConfigProvider>
    );
    expect(container.firstChild).toHaveAttribute('data-theme', 'dark');
  });

  it('a local zest prop overrides a global provider default', () => {
    const { container } = render(
      <ZestSidekickConfigProvider config={{ defaultProps: { theme: 'dark' } }}>
        <SidekickMenu items={simpleItems} zest={{ theme: 'light' }} />
      </ZestSidekickConfigProvider>
    );
    expect(container.firstChild).toHaveAttribute('data-theme', 'light');
  });

  it('exposes each visible item\'s position as a --zest-stagger-index CSS variable, for the stagger-in animation', () => {
    const multipleItems: ISidekickMenuItem[] = [
      { id: 'a', label: 'A', icon: '', searchTerms: '', path: '/a' },
      { id: 'b', label: 'B', icon: '', searchTerms: '', path: '/b' },
      { id: 'c', label: 'C', icon: '', searchTerms: '', path: '/c' },
    ];
    render(<SidekickMenu items={multipleItems} />);

    expect(screen.getByText('A').closest('li')).toHaveStyle('--zest-stagger-index: 0');
    expect(screen.getByText('B').closest('li')).toHaveStyle('--zest-stagger-index: 1');
    expect(screen.getByText('C').closest('li')).toHaveStyle('--zest-stagger-index: 2');
  });
});

const nestedItems: ISidekickMenuItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: '',
    searchTerms: '',
    children: [
      { id: 'profile', label: 'Profile', icon: '', searchTerms: '', path: '/settings/profile' },
      { id: 'billing', label: 'Billing', icon: '', searchTerms: '', path: '/settings/billing' },
    ],
  },
  { id: 'about', label: 'About', icon: '', searchTerms: '', path: '/about' },
];

describe('SidekickMenu drilldown navigation (new default)', () => {
  it('clicking a parent item shows only its children, not the sibling root items', () => {
    render(<SidekickMenu items={nestedItems} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Settings'));

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.queryByText('About')).not.toBeInTheDocument();
    // "Settings" is legitimately still shown as the current breadcrumb crumb, but not as a clickable row anymore.
    expect(screen.queryByText('Settings')?.closest('li')).toBeNull();
  });

  it('shows a breadcrumb trail after drilling in, and the back button returns to the parent list', () => {
    render(<SidekickMenu items={nestedItems} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Settings'));

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('ArrowDown highlighting only moves through items still visible after a search filters the list', () => {
    const items: ISidekickMenuItem[] = [
      { id: 'apple', label: 'Apple', icon: '', searchTerms: '', path: '/apple' },
      { id: 'banana', label: 'Banana', icon: '', searchTerms: '', path: '/banana' },
      { id: 'apricot', label: 'Apricot', icon: '', searchTerms: '', path: '/apricot' },
    ];
    const { container } = render(<SidekickMenu items={items} alwaysShowUnsearchableItems={false} />);
    fireEvent.click(screen.getByRole('button'));

    fireEvent.change(screen.getByPlaceholderText('Search menu...'), { target: { value: 'ap' } });
    // "Banana" is filtered out; only Apple and Apricot remain.
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();

    const navRoot = container.firstChild as HTMLElement;
    fireEvent.keyDown(navRoot, { key: 'ArrowDown' });
    fireEvent.keyDown(navRoot, { key: 'ArrowDown' });

    // With only 2 filtered items, highlighting must clamp to the second one (Apricot), not run past it.
    const highlighted = container.querySelectorAll('[data-highlighted="true"]');
    expect(highlighted.length).toBe(1);
    expect(highlighted[0]).toHaveTextContent('Apricot');
  });

  it('a number shortcut only activates an item still visible after a search filters the list', () => {
    const onApple = jest.fn();
    const onApricot = jest.fn();
    const items: ISidekickMenuItem[] = [
      { id: 'apple', label: 'Apple', icon: '', searchTerms: '', onClick: onApple },
      { id: 'banana', label: 'Banana', icon: '', searchTerms: '', onClick: jest.fn() },
      { id: 'apricot', label: 'Apricot', icon: '', searchTerms: '', onClick: onApricot },
    ];
    render(<SidekickMenu items={items} alwaysShowUnsearchableItems={false} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText('Search menu...'), { target: { value: 'ap' } });

    fireEvent.keyDown(screen.getByPlaceholderText('Search menu...'), { code: 'Digit2' });

    // Digit "2" among the filtered (Apple, Apricot) set should activate Apricot, not Banana.
    expect(onApricot).toHaveBeenCalled();
    expect(onApple).not.toHaveBeenCalled();
  });

  it('clicking a leaf item fires its action and closes the menu', () => {
    const onClick = jest.fn();
    const items: ISidekickMenuItem[] = [{ id: 'go', label: 'Go', icon: '', searchTerms: '', onClick }];
    render(<SidekickMenu items={items} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Go'));

    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '' })).not.toHaveClass('open');
  });

  it('navigationStyle="accordion" does not render a breadcrumb even after clicking a parent item', () => {
    render(<SidekickMenu items={nestedItems} navigationStyle="accordion" />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Settings'));

    expect(screen.queryByRole('navigation', { name: /breadcrumb/i })).not.toBeInTheDocument();
    // Accordion mode keeps siblings visible alongside the expanded branch.
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});

describe('SidekickMenu body scroll lock (mobile overlay only)', () => {
  const originalOverflow = document.body.style.overflow;

  afterEach(() => {
    document.body.style.overflow = originalOverflow;
  });

  it('locks body scroll while the mobile overlay menu is open', () => {
    render(<SidekickMenu items={simpleItems} />);
    fireEvent.click(screen.getByRole('button'));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when the menu closes', () => {
    render(<SidekickMenu items={simpleItems} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('restores body scroll on unmount while still open', () => {
    const { unmount } = render(<SidekickMenu items={simpleItems} />);
    fireEvent.click(screen.getByRole('button'));
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('does not lock body scroll in desktop push mode (openOnDesktop)', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    render(<SidekickMenu items={simpleItems} openOnDesktop />);
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});

describe('SidekickMenu scrim and click-outside', () => {
  it('clicking outside the open panel closes the menu', () => {
    const { container } = render(
      <>
        <div data-testid="outside">Outside</div>
        <SidekickMenu items={simpleItems} />
      </>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(container.querySelector(`.${'open'}`)).toBeTruthy();

    fireEvent.mouseDown(screen.getByTestId('outside'));

    const hamburger = screen.getByRole('button');
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking inside the panel does not close the menu', () => {
    render(<SidekickMenu items={simpleItems} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.mouseDown(screen.getByText('Home'));

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('SidekickMenu RTL awareness', () => {
  const originalDir = document.documentElement.dir;

  afterEach(() => {
    document.documentElement.dir = originalDir;
  });

  it('side="auto" defaults to the right on a desktop-width RTL page', () => {
    document.documentElement.dir = 'rtl';
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    const { container } = render(<SidekickMenu items={simpleItems} side="auto" />);
    expect(container.querySelector('.container')).toHaveClass('right');
  });
});

describe('SidekickMenu accordion deprecation warning', () => {
  let warnSpy: jest.SpyInstance;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    warnSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it('warns once when navigationStyle="accordion" is explicitly set', () => {
    render(<SidekickMenu items={simpleItems} navigationStyle="accordion" />);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/deprecated/i);
  });

  it('does not warn for the default drilldown navigation style', () => {
    render(<SidekickMenu items={simpleItems} />);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('SidekickMenu Favourites', () => {
  it('does not show a Favourites tab when favouritesEnabled is false (default)', () => {
    render(<SidekickMenu items={nestedItems} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('tab', { name: 'Favourites' })).not.toBeInTheDocument();
  });

  it('shows the Favourites tab once enough items have been used, and clicking a favourite fires its action', () => {
    const onClick = jest.fn();
    const items: ISidekickMenuItem[] = [
      { id: 'a', label: 'Alpha', icon: '', searchTerms: '', onClick },
      { id: 'b', label: 'Beta', icon: '', searchTerms: '', onClick: jest.fn() },
      { id: 'c', label: 'Gamma', icon: '', searchTerms: '', onClick: jest.fn() },
    ];
    render(<SidekickMenu items={items} favouritesEnabled favouritesOptions={{ minToShowTab: 3 }} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Alpha'));

    // Re-open and use two more items to cross the cold-start threshold.
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Beta'));
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Gamma'));

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('tab', { name: 'Favourites' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByText('Alpha'));
    expect(onClick).toHaveBeenCalled();
  });
});
