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
