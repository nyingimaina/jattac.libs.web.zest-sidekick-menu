import fs from 'fs';
import path from 'path';

const css = fs.readFileSync(path.join(__dirname, 'SidekickMenu.module.css'), 'utf-8');

describe('SidekickMenu.module.css theming cascade', () => {
  it('defines light-mode --zest-* tokens unconditionally on :root', () => {
    const rootBlock = css.match(/:root\s*{[^}]*}/);
    expect(rootBlock).not.toBeNull();
    expect(rootBlock![0]).toMatch(/--zest-color-panel-bg:/);
    expect(rootBlock![0]).toMatch(/--zest-ease-spring:/);
    expect(rootBlock![0]).toMatch(/--zest-ease-standard:/);
    expect(rootBlock![0]).toMatch(/--zest-motion-fast:/);
    expect(rootBlock![0]).toMatch(/--zest-motion-base:/);
  });

  it('redefines the tokens for the OS dark case behind a prefers-color-scheme media query', () => {
    expect(css).toMatch(/@media \(prefers-color-scheme:\s*dark\)\s*{/);
  });

  it('gives an explicit data-theme="dark" attribute its own override tier', () => {
    expect(css).toMatch(/\.container\[data-theme="dark"\]\s*{/);
  });

  it('gives an explicit data-theme="light" attribute its own override tier', () => {
    expect(css).toMatch(/\.container\[data-theme="light"\]\s*{/);
  });

  it('leaves the legacy :global(.dark) rules untouched for backward compatibility', () => {
    expect(css).toMatch(/:global\(\.dark\)\s*\.panel\s*{/);
    expect(css).toMatch(/:global\(\.dark\)\s*\.menuItem\s*{/);
  });

  it('respects prefers-reduced-motion by disabling animation/transform-based motion', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)\s*{/);
  });

  it('defines standard and subtle motion tiers via the data-motion attribute', () => {
    expect(css).toMatch(/\.container\[data-motion="standard"\]/);
    expect(css).toMatch(/\.container\[data-motion="subtle"\]/);
  });
});

describe('SidekickMenu.module.css flat design (no skeuomorphism)', () => {
  it('does not use a gradient "sheen" sweep on menu items', () => {
    expect(css).not.toMatch(/sidekickItemSheen/);
  });

  it('only uses linear-gradient for the (still-current) skeleton loading shimmer, nowhere else', () => {
    const occurrences = (css.match(/linear-gradient\(/g) || []).length;
    // Exactly two: the default skeleton shimmer and its :global(.dark) override.
    expect(occurrences).toBe(2);
  });

  it('does not scale menu items on hover (no card-lift affordance)', () => {
    const hoverBlock = css.match(/\.menuItem:hover\s*{[^}]*}/);
    expect(hoverBlock).not.toBeNull();
    expect(hoverBlock![0]).not.toMatch(/transform:\s*scale/);
    expect(hoverBlock![0]).not.toMatch(/animation:/);
  });

  it('gives menu item rows a rounded, inset "pill" treatment instead of full-width divider lines', () => {
    const menuItemBlock = css.match(/\n\.menuItem\s*{[^}]*}/);
    expect(menuItemBlock).not.toBeNull();
    expect(menuItemBlock![0]).toMatch(/border-radius:\s*var\(--zest-radius-sm/);
    expect(menuItemBlock![0]).not.toMatch(/border-bottom:/);
  });

  it('marks the keyboard-highlighted item with a flat accent-colored indicator, not a gradient or bevel', () => {
    const highlightedBlock = css.match(/\n\.menuItem\.highlighted\s*{[^}]*}/);
    expect(highlightedBlock).not.toBeNull();
    expect(highlightedBlock![0]).toMatch(/border-left:/);
    expect(highlightedBlock![0]).not.toMatch(/gradient|inset/);
  });
});

describe('SidekickMenu.module.css — Workstream 2/3 surfaces', () => {
  it('defines a scrim element for click-outside-to-close', () => {
    expect(css).toMatch(/\.scrim\s*{/);
  });

  it('defines breadcrumb, tab switcher, and favourites-related selectors', () => {
    expect(css).toMatch(/\.breadcrumb\s*{/);
    expect(css).toMatch(/\.breadcrumbCrumb\s*{/);
    expect(css).toMatch(/\.breadcrumbBack\s*{/);
    expect(css).toMatch(/\.tabSwitcher\s*{/);
    expect(css).toMatch(/\.tabButton\s*{/);
    expect(css).toMatch(/\.itemSecondaryText\s*{/);
    expect(css).toMatch(/\.pinToggle\s*{/);
    expect(css).toMatch(/\.numberBadge\s*{/);
  });

  it('provides a visually-hidden-but-screen-reader-visible utility class', () => {
    expect(css).toMatch(/\.srOnly\s*{/);
  });

  it('supports desktop rail-collapse via a dedicated width token', () => {
    expect(css).toMatch(/--zest-rail-width:/);
    expect(css).toMatch(/\.railCollapsed/);
  });

  it('guards the optional translucent surface with @supports and keeps solid as the default', () => {
    expect(css).toMatch(/@supports\s*\(backdrop-filter/);
    expect(css).toMatch(/data-surface="translucent"/);
  });

  it('adds a prefers-contrast block alongside the existing reduced-motion one', () => {
    expect(css).toMatch(/@media \(prefers-contrast:\s*more\)\s*{/);
  });
});

describe('SidekickMenu.module.css — stacking order (regression: scrim must never cover the panel)', () => {
  const getZIndex = (selectorPattern: RegExp): number => {
    const block = css.match(selectorPattern);
    expect(block).not.toBeNull();
    const zIndexMatch = block![0].match(/z-index:\s*(-?\d+)/);
    expect(zIndexMatch).not.toBeNull();
    return parseInt(zIndexMatch![1], 10);
  };

  it("gives .panel its own explicit z-index higher than .scrim's, so scrim never intercepts clicks meant for menu content", () => {
    const scrimZ = getZIndex(/\n\.scrim\s*{[^}]*}/);
    const panelZ = getZIndex(/\n\.panel\s*{[^}]*}/);
    expect(panelZ).toBeGreaterThan(scrimZ);
  });

  it("keeps .hamburger's z-index above .panel's, so the toggle button always stays clickable", () => {
    const panelZ = getZIndex(/\n\.panel\s*{[^}]*}/);
    const hamburgerZ = getZIndex(/\n\.hamburger\s*{[^}]*}/);
    expect(hamburgerZ).toBeGreaterThan(panelZ);
  });
});

describe('SidekickMenu.module.css — visible staggered hide on close', () => {
  it('delays the closing panel slide so the staggered item hide finishes while the panel is still visible', () => {
    expect(css).toMatch(/\.panel:not\(\.open\)\s*{[^}]*transition-delay:\s*calc\(var\(--zest-motion-stagger-step/);
  });
});

describe('SidekickMenu.module.css — mobile-first touch targets, desktop-refined', () => {
  const MOBILE_MIN_PX = 44;

  const getBaseBlock = (selectorPattern: RegExp): string => {
    const block = css.match(selectorPattern);
    expect(block).not.toBeNull();
    return block![0];
  };

  const getMinDimension = (block: string): number => {
    const minWidth = block.match(/min-width:\s*(\d+)px/);
    const minHeight = block.match(/min-height:\s*(\d+)px/);
    expect(minWidth || minHeight).not.toBeNull();
    return Math.min(
      minWidth ? parseInt(minWidth[1], 10) : Infinity,
      minHeight ? parseInt(minHeight[1], 10) : Infinity
    );
  };

  it('gives the breadcrumb back/crumb buttons a 44px minimum tap target by default (mobile-first)', () => {
    const block = getBaseBlock(/\n\.breadcrumbBack,\s*\n\.breadcrumbCrumb\s*{[^}]*}/);
    expect(getMinDimension(block)).toBeGreaterThanOrEqual(MOBILE_MIN_PX);
  });

  it('gives the pin toggle a 44px minimum tap target by default (mobile-first)', () => {
    const block = getBaseBlock(/\n\.pinToggle\s*{[^}]*}/);
    expect(getMinDimension(block)).toBeGreaterThanOrEqual(MOBILE_MIN_PX);
  });

  it('gives each tab button a comfortable minimum height by default (mobile-first)', () => {
    const block = getBaseBlock(/\n\.tabButton\s*{[^}]*}/);
    expect(getMinDimension(block)).toBeGreaterThanOrEqual(MOBILE_MIN_PX);
  });

  it('tightens the breadcrumb/tab/pin controls back down for desktop pointer precision', () => {
    // There may be multiple @media (min-width: 768px) blocks; find the one covering these selectors.
    const allDesktopBlocks = css.match(/@media \(min-width:\s*768px\)\s*{[\s\S]*?\n}\n/g) || [];
    const covering = allDesktopBlocks.find(
      (b) => b.includes('.breadcrumbCrumb') || b.includes('.tabButton') || b.includes('.pinToggle')
    );
    expect(covering).toBeDefined();
    expect(covering).toMatch(/min-height:\s*0/);
  });

  it('gives the hamburger button a full 44px+ tap target', () => {
    const block = getBaseBlock(/\n\.hamburger\s*{[^}]*}/);
    const width = block.match(/width:\s*(\d+)px/);
    const height = block.match(/height:\s*(\d+)px/);
    const padding = block.match(/padding:\s*(\d+)px\s+(\d+)px/);
    expect(width && height && padding).toBeTruthy();
    const totalHeight = parseInt(height![1], 10) + 2 * parseInt(padding![1], 10);
    const totalWidth = parseInt(width![1], 10) + 2 * parseInt(padding![2], 10);
    expect(Math.min(totalHeight, totalWidth)).toBeGreaterThanOrEqual(MOBILE_MIN_PX);
  });
});

describe('SidekickMenu.module.css — other mobile-first robustness fixes', () => {
  it('positions the hamburger with safe-area-aware top/left, not just a fixed offset', () => {
    const block = css.match(/\n\.hamburger\s*{[^}]*}/)![0];
    expect(block).toMatch(/top:\s*calc\([^)]*env\(safe-area-inset-top/);
    expect(block).toMatch(/left:\s*calc\([^)]*env\(safe-area-inset-left/);
  });

  it('uses dynamic viewport height (100dvh) as a progressive enhancement over 100vh, to avoid the iOS toolbar cutting off content', () => {
    const block = css.match(/\n\.panel\s*{[^}]*}/)![0];
    expect(block).toMatch(/height:\s*100vh/);
    expect(block).toMatch(/height:\s*100dvh/);
  });

  it('caps the panel width to the viewport on mobile instead of a fixed 300px that can overflow very narrow screens', () => {
    const block = css.match(/\n\.panel\s*{[^}]*}/)![0];
    expect(block).toMatch(/width:\s*min\(\s*300px\s*,\s*\d+vw\s*\)/);
  });

  it('restores the panel to a fixed 300px width on desktop, independent of openOnDesktop', () => {
    const allDesktopBlocks = css.match(/@media \(min-width:\s*768px\)\s*{[\s\S]*?\n}\n/g) || [];
    const generalPanelWidthBlock = allDesktopBlocks.find(
      (b) => /\n\s*\.panel\s*{[^}]*width:\s*300px/.test(b)
    );
    expect(generalPanelWidthBlock).toBeDefined();
  });

  it('prevents the menu list from chaining scroll into the page behind it', () => {
    const block = css.match(/\n\.menuList\s*{[^}]*}/)![0];
    expect(block).toMatch(/overscroll-behavior:\s*contain/);
  });
});
