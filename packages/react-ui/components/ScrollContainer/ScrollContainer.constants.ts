import { getScrollWidth } from '../../lib/dom/getScrollWidth';

import { ScrollState } from './ScrollContainer.types';

export const HIDE_SCROLL_X_OFFSET = getScrollWidth();
export const HIDE_SCROLL_Y_OFFSET = 30;
export const MIN_SCROLL_SIZE = 20;

export const defaultScrollYState: ScrollState = {
  active: false,
  size: 0,
  pos: 0,
  // Mouse is moving where big scrollbar can be located.
  hover: false,
  // True when scroll is following mouse (mouse down on scroll).
  scrolling: false,
  scrollState: 'top',
};

export const defaultScrollXState: ScrollState = {
  active: false,
  size: 0,
  pos: 0,
  // Mouse is moving where big scrollbar can be located.
  hover: false,
  // True when scroll is following mouse (mouse down on scroll).
  scrolling: false,
};

export const scrollSizeParameterName = {
  x: {
    offset: 'offsetWidth',
    size: 'scrollWidth',
    pos: 'scrollLeft',
  },
  y: {
    offset: 'offsetHeight',
    size: 'scrollHeight',
    pos: 'scrollTop',
  },
} as const;