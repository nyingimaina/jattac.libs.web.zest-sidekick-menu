import React, { createContext, useContext, Dispatch } from 'react';
import { ISidekickMenuItem } from '../types';

// The state that will be managed by the reducer
export interface MenuState {
  isOpen: boolean;
  searchTerm: string;
  highlightedIndex: number;
  openSubMenus: { [key: string]: boolean };
  itemVisibility: { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" };
  /** Drilldown navigation only: item-id breadcrumb trail from the root. */
  currentPath: string[];
  /** Favourites only: which tab is currently shown. */
  activeTab: "favourites" | "all";
  /** Desktop rail-collapse only. */
  railCollapsed: boolean;
}

// The actions that the reducer will handle
export type MenuAction =
  | { type: 'SET_IS_OPEN'; payload: boolean }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_HIGHLIGHTED_INDEX'; payload: number }
  | { type: 'TOGGLE_SUBMENU'; payload: string }
  | { type: 'SET_OPEN_SUBMENUS'; payload: { [key: string]: boolean } }
  | { type: 'SET_ITEM_VISIBILITY'; payload: { [key: string]: "VISIBLE" | "HIDDEN" | "PENDING" } }
  | { type: 'CLOSE_MENU' }
  | { type: 'DRILL_IN'; payload: string }
  | { type: 'DRILL_BACK' }
  | { type: 'DRILL_TO_INDEX'; payload: number }
  | { type: 'SET_ACTIVE_TAB'; payload: 'favourites' | 'all' }
  | { type: 'TOGGLE_RAIL' };

// The reducer function
export const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case 'SET_IS_OPEN':
      return { ...state, isOpen: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_HIGHLIGHTED_INDEX':
      return { ...state, highlightedIndex: action.payload };
    case 'TOGGLE_SUBMENU':
      return {
        ...state,
        openSubMenus: {
          ...state.openSubMenus,
          [action.payload]: !state.openSubMenus[action.payload],
        },
      };
    case 'SET_OPEN_SUBMENUS':
      return { ...state, openSubMenus: action.payload };
    case 'SET_ITEM_VISIBILITY':
        return { ...state, itemVisibility: { ...state.itemVisibility, ...action.payload } };
    case 'CLOSE_MENU':
      return { ...state, isOpen: false, searchTerm: '', highlightedIndex: -1, currentPath: [] };
    case 'DRILL_IN':
      return { ...state, currentPath: [...state.currentPath, action.payload], highlightedIndex: -1 };
    case 'DRILL_BACK':
      return { ...state, currentPath: state.currentPath.slice(0, -1), highlightedIndex: -1 };
    case 'DRILL_TO_INDEX':
      return { ...state, currentPath: state.currentPath.slice(0, action.payload + 1), highlightedIndex: -1 };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'TOGGLE_RAIL':
      return { ...state, railCollapsed: !state.railCollapsed };
    default:
      return state;
  }
};

// The shape of the context value
export interface MenuContextProps {
  state: MenuState;
  dispatch: Dispatch<MenuAction>;
  items: ISidekickMenuItem[];
  closeMenu: () => void;
  toggleSubMenu: (id: string) => void;
  setHighlightedIndex: (index: number) => void;
  // Let's also pass down some of the main component props
  searchIcon?: React.ReactNode;
  chevronIcon?: React.ReactNode;
  alwaysShowUnsearchableItems: boolean;
}

// The context itself
export const MenuContext = createContext<MenuContextProps | undefined>(undefined);

// A custom hook to consume the context
export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};
