import * as PropTypes from 'prop-types';

import { isBrowser } from './client';
import { Upgrade } from './Upgrades';

export function safePropTypesInstanceOf<T>(
  getExpectedClass: () => new (...args: any[]) => T,
): PropTypes.Requireable<T> {
  if (isBrowser) {
    return PropTypes.instanceOf(getExpectedClass());
  }

  return PropTypes.any;
}

export function isElement(el: unknown): el is Element {
  if (isBrowser) {
    return el instanceof globalThat['Element'];
  }

  return false;
}

export function isHTMLElement(el: unknown): el is HTMLElement {
  if (isBrowser) {
    return el instanceof globalThat['HTMLElement'];
  }

  return false;
}

export function isHTMLInputElement(el: unknown): el is HTMLInputElement {
  if (isBrowser) {
    return el instanceof globalThat['HTMLInputElement'];
  }

  return false;
}

export function isNode(node: unknown): node is Node {
  if (isBrowser) {
    return node instanceof globalThat['Node'];
  }

  return false;
}

export function isTouchEvent(node: unknown): node is TouchEvent {
  if (isBrowser) {
    return node instanceof globalThat['TouchEvent'];
  }

  return false;
}

export function isWheelEvent(node: unknown): node is WheelEvent {
  if (isBrowser) {
    return node instanceof globalThat['WheelEvent'];
  }

  return false;
}

export function isMouseEvent(node: unknown): node is MouseEvent {
  if (isBrowser) {
    return node instanceof globalThat['MouseEvent'];
  }

  return false;
}

export function isKeyboardEvent(node: unknown): node is KeyboardEvent {
  if (isBrowser) {
    return node instanceof globalThat['KeyboardEvent'];
  }

  return false;
}

export function matchMediaSSRSafe(mediaQuery: string) {
  if (isBrowser) {
    return globalThat.matchMedia(mediaQuery);
  }
}

export const globalThat: typeof globalThis =
  Upgrade.getWindow() ||
  (typeof globalThis === 'object' && globalThis) ||
  (typeof global === 'object' && global) ||
  (typeof window === 'object' && window) ||
  Function('return this')();

export const renderTarget: Document = Upgrade.getDocument() || globalThat.document;
