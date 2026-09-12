import { menuReducer, MenuState } from './MenuContext';

const baseState: MenuState = {
  isOpen: true,
  searchTerm: 'foo',
  highlightedIndex: 2,
  openSubMenus: { a: true },
  itemVisibility: {},
  currentPath: ['a', 'b'],
  activeTab: 'favourites',
  railCollapsed: false,
};

describe('menuReducer (baseline behavior, unchanged)', () => {
  it('SET_IS_OPEN sets isOpen', () => {
    expect(menuReducer(baseState, { type: 'SET_IS_OPEN', payload: false }).isOpen).toBe(false);
  });

  it('TOGGLE_SUBMENU toggles the given id', () => {
    const result = menuReducer(baseState, { type: 'TOGGLE_SUBMENU', payload: 'a' });
    expect(result.openSubMenus.a).toBe(false);
  });
});

describe('menuReducer drilldown actions', () => {
  it('DRILL_IN pushes an id onto currentPath and resets highlightedIndex', () => {
    const result = menuReducer(baseState, { type: 'DRILL_IN', payload: 'c' });
    expect(result.currentPath).toEqual(['a', 'b', 'c']);
    expect(result.highlightedIndex).toBe(-1);
  });

  it('DRILL_BACK pops the last entry off currentPath', () => {
    const result = menuReducer(baseState, { type: 'DRILL_BACK' });
    expect(result.currentPath).toEqual(['a']);
  });

  it('DRILL_BACK on an empty path is a no-op on the path', () => {
    const result = menuReducer({ ...baseState, currentPath: [] }, { type: 'DRILL_BACK' });
    expect(result.currentPath).toEqual([]);
  });

  it('DRILL_TO_INDEX truncates the path to that breadcrumb segment (inclusive)', () => {
    const result = menuReducer(
      { ...baseState, currentPath: ['a', 'b', 'c'] },
      { type: 'DRILL_TO_INDEX', payload: 0 }
    );
    expect(result.currentPath).toEqual(['a']);
  });

  it('SET_ACTIVE_TAB sets the active tab', () => {
    expect(menuReducer(baseState, { type: 'SET_ACTIVE_TAB', payload: 'all' }).activeTab).toBe('all');
  });

  it('CLOSE_MENU resets currentPath in addition to its existing behavior', () => {
    const result = menuReducer(baseState, { type: 'CLOSE_MENU' });
    expect(result.isOpen).toBe(false);
    expect(result.searchTerm).toBe('');
    expect(result.highlightedIndex).toBe(-1);
    expect(result.currentPath).toEqual([]);
  });
});

describe('menuReducer rail collapse (Workstream 3)', () => {
  it('TOGGLE_RAIL flips railCollapsed', () => {
    expect(menuReducer(baseState, { type: 'TOGGLE_RAIL' }).railCollapsed).toBe(true);
    expect(menuReducer({ ...baseState, railCollapsed: true }, { type: 'TOGGLE_RAIL' }).railCollapsed).toBe(false);
  });
});
