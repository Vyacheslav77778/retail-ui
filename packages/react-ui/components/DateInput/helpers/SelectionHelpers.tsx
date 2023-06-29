import { globalThat, renderTarget } from '../../../lib/SSRSafe';

export const selectNodeContents = (node: HTMLElement | null, start?: number, end?: number) => {
  if (!node) {
    return;
  }
  if ('createRange' in renderTarget) {
    try {
      const selection = globalThat.getSelection();
      const range = renderTarget.createRange();
      if (start !== undefined && end !== undefined) {
        range.setStart(node, start);
        range.setEnd(node, end);
      } else {
        range.selectNodeContents(node);
      }
      if (selection !== null) {
        // Fix IE from issue not working (https://github.com/skbkontur/retail-ui/issues/1205)
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
    } catch (e) {
      // empty block
    }
  }

  // @ts-expect-error: IE-specific API.
  if (typeof renderTarget.body.createTextRange === 'function') {
    // @ts-expect-error: Read the comment above.
    const range = renderTarget.body.createTextRange();
    range.moveToElementText(node);
    if (typeof range.select === 'function') {
      range.select();
    }
    return;
  }
};

export const removeAllSelections = () => {
  const selection = globalThat.getSelection();
  if (selection !== null) {
    try {
      // Fix IE from issue not working (https://github.com/skbkontur/retail-ui/issues/1205)
      selection.removeAllRanges();
    } catch (e) {
      // empty block
    }
  }
};
