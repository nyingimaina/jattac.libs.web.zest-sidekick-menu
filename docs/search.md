---
title: Search (opt-in)
covers: UI/SidekickMenu/SidekickMenu.tsx, UI/SidekickMenu/types.ts, UI/SidekickMenu/utils/search.ts, UI/SidekickMenu/components/DrilldownMenuList.tsx, UI/SidekickMenu/components/MenuList.tsx
covers-hash: 48cfa8c9bf3025f35cf9
---

# Search (opt-in)

## Overview

`SidekickMenu` can put a search box at the top of the menu panel that filters the items as the user types.

Since version **2.0.0** the box is **opt-in**: the `searchEnabled` prop defaults to `false`, so a menu rendered as `<SidekickMenu items={items} />` has no search input at all. You get the box only on the menus where you pass `searchEnabled={true}`.

This page is for:

- a developer who wants the search box on one of their menus;
- a developer upgrading from 1.x who found that the box disappeared and wants it back.

You do not need to know the component's internals. If you only want the reference tables, see the [API Reference](api.md).

Two terms used below:

- **Opt-in** means a feature appears only when you explicitly ask for it with a prop.
- **Search term** is the text the user has typed into the box.

Nothing about the search box is stored in the browser. The default lives in the component, so every existing installation gets the hidden box simply by upgrading — and no stored preference can turn it back on.

## Before you start

- The package is installed:

  ```bash
  npm install jattac.libs.web.zest-sidekick-menu
  ```

- You have an `items` array. Each item needs an `id`, a `label`, an `icon`, and exactly one of `path`, `onClick` or `children`. The [API Reference](api.md#2-isidekickmenuitem-interface) describes the shape.
- You know that search hides an item only when the item has a non-empty `searchTerms` string and neither its label nor those terms match. Items with no `searchTerms` stay visible by default. This surprises people, so it is explained under [Edge cases](#edge-cases) and [Pitfalls](#pitfalls).

## Step by step

1. Render the menu with `searchEnabled={true}`. This is a complete, runnable file:

   ```jsx
   import React from 'react';
   import SidekickMenu from 'jattac.libs.web.zest-sidekick-menu';

   const items = [
     { id: 'articles', label: 'Articles', icon: '📰', searchTerms: 'news blog posts', path: '/articles' },
     { id: 'docs', label: 'Documentation', icon: '📘', searchTerms: 'help guide manual', path: '/docs' },
     { id: 'contact', label: 'Contact Us', icon: '✉️', searchTerms: 'support helpdesk', path: '/contact' },
   ];

   const App = () => <SidekickMenu items={items} searchEnabled={true} />;

   export default App;
   ```

2. Open the menu with the hamburger button. You should see a text box at the top of the panel whose placeholder reads `Search menu...`, with a magnifying glass (`🔍`) on its right. Because `searchAutoFocus` defaults to `true`, the caret is already in the box and you can type immediately.

3. Type `doc`. The list shrinks to *Documentation*, the only item whose label or `searchTerms` contains `doc`.

4. Clear the box. The full list returns. If you had drilled into a section before you started searching, you are taken back to that section.

That is the whole setup. The optional props are:

| Prop | Default | What it changes |
| :--- | :--- | :--- |
| `searchEnabled` | `false` | `true` renders the search box; anything else renders none. |
| `searchPlaceholder` | `"Search menu..."` | The hint text inside the box. |
| `searchIcon` | `"🔍"` | The React node shown at the right edge of the box. |
| `searchAutoFocus` | `true` | Whether the box takes focus when the menu opens. |
| `alwaysShowUnsearchableItems` | `true` | Whether items without `searchTerms` stay visible while a term is active. |

## Examples

### Enable search with your own placeholder and icon

```jsx
import React from 'react';
import SidekickMenu from 'jattac.libs.web.zest-sidekick-menu';
import { FaSearch } from 'react-icons/fa';

const SearchableApp = () => (
  <SidekickMenu
    items={[
      { id: 'articles', label: 'Articles', icon: '📰', searchTerms: 'news blog posts', path: '/articles' },
      { id: 'docs', label: 'Documentation', icon: '📘', searchTerms: 'help guide manual', path: '/docs' },
    ]}
    searchEnabled={true}
    searchPlaceholder="Find pages..."
    searchIcon={<FaSearch />}
  />
);

export default SearchableApp;
```

When it works, the box reads `Find pages...` and shows your icon instead of the magnifying glass.

### Bring the search box back after upgrading from 1.x

In 1.x this showed the box:

```jsx
<SidekickMenu items={items} />
```

From 2.0.0 it does not. Add the prop:

```jsx
<SidekickMenu items={items} searchEnabled={true} />
```

Menus that already passed `searchEnabled={false}` need no change. The full upgrade note is in [Breaking Changes & Migration](breaking-changes.md#v200--search-is-now-opt-in-searchenabled-defaults-to-false).

### Make the search narrow the list

By default, items without a `searchTerms` value are never filtered out. Give each item search terms, as in the examples above, or turn the rule off:

```jsx
<SidekickMenu items={items} searchEnabled={true} alwaysShowUnsearchableItems={false} />
```

With `alwaysShowUnsearchableItems={false}`, an item with no `searchTerms` is shown only when its label matches the term, or when it has children that match.

## Scenarios

**A large menu where users know the page name.** Turn search on. Users open the menu and type two or three letters of the label; the list narrows while they type.

**A user deep inside a section.** Search still covers the whole menu, not just the current section: typing while inside *Settings* jumps to the matching items at the top level. Clearing the box returns the user to *Settings*.

**A menu built with `navigationStyle="accordion"`.** Search behaves as it did in 1.x: matching branches are expanded in place instead of replacing the list.

**A menu that also has favourites.** The search props and the favourites props are independent. `searchEnabled` does not control the Favourites tab, pinning, the rail, swipe gestures or numbered shortcuts.

## Edge cases

- **A collapsed desktop rail.** With `railCollapsible` and the rail collapsed, the search box is not shown even when `searchEnabled={true}`. Expanding the rail brings it back.
- **`searchAutoFocus={false}`.** The box is rendered but does not take focus when the menu opens. The user clicks it to type.
- **Search turned off while a term is typed.** The input disappears and the term is cleared, so the list is not left filtered by text the user can no longer see.
- **No matches.** The list is simply empty. There is no "no results" message and no new empty state.
- **Closing and reopening.** The search term is never saved. A reopened menu starts with an empty box.
- **Items with no `searchTerms`.** While a term is active they stay visible when `alwaysShowUnsearchableItems` is `true` (the default). That is why typing may appear to do nothing on a menu whose items define no `searchTerms`.
- **Multi-word terms.** The term is split on spaces, and an item matches when **any** one of those words matches — either its label contains the word, or a word in its `searchTerms` contains it. It is not an "all words must match" search.
- **Search when the box is off.** No input element is rendered at all. There is nothing for Tab or a screen reader to reach, and no empty gap is left at the top of the panel.

## Pitfalls

- **Do not expect search after a plain upgrade.** An app that renders `<SidekickMenu items={items} />` has no search box from 2.0.0 onwards. That is the intended breaking change, not a bug.
- **Do not look for the input when search is off.** It is not mounted, so `getByPlaceholderText("Search menu...")` and similar queries fail. Enable search in the test first, then assert the input exists, then type into it.
- **Do not enable search but leave every item without `searchTerms`.** With the default `alwaysShowUnsearchableItems={true}`, non-matching items with no `searchTerms` stay on screen. Add terms, or set the prop to `false`.
- **Do not use `searchEnabled` to switch other features.** Favourites, breadcrumbs, numbered shortcuts, swipe and the rail all work with search off.

## Best practices

- Turn search on only for menus large enough to need it; the default menu stays cleaner without the box.
- Give each item a `searchTerms` string that includes the words users are likely to type, including synonyms that do not appear in the label (for example `label: 'Documentation'` with `searchTerms: 'help guide manual'`).
- Keep the placeholder short. The default `Search menu...` is usually enough; change it when the menu spans several areas of the app.
- If users normally open the menu to browse rather than to search, set `searchAutoFocus={false}` so opening the menu does not move focus into the box.

## See also

- [API Reference](api.md) — the full prop table and the `ISidekickMenuItem` type.
- [Configuration Guide](configuration.md#4-fine-tuning-search-behavior) — defaults and the search section.
- [The Cookbook: Practical Examples](examples.md#3-enabling-and-customizing-search) — the search recipe with a custom icon.
- [Features Showcase](features.md#2-built-in-search-functionality) — where search fits among the other features.
- [Breaking Changes & Migration](breaking-changes.md#v200--search-is-now-opt-in-searchenabled-defaults-to-false) — the 2.0.0 upgrade note.
