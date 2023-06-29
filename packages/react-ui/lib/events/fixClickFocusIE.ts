import { getClosestFocusableElement } from '../dom/tabbableHelpers';
import { isIE11, isEdge } from '../client';
import { renderTarget } from '../SSRSafe';

export const fixClickFocusIE = (e: Event) => {
  if (isIE11 || isEdge) {
    // workaround for the IE/Edge focus bug
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/14306303/
    if (renderTarget.activeElement !== e.target) {
      if (e.target instanceof HTMLElement) {
        const closestFocusable = getClosestFocusableElement(e.target);
        if (closestFocusable) {
          closestFocusable.focus();
        }
      }
    }
  }
};
