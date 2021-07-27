import { css } from '../../lib/theming/Emotion';
import { shift } from '../../lib/styles/DimensionFunctions';

import { globalClassNames } from './Button.styles';

const getBtnPadding = (
  fontSize: string,
  paddingY: string,
  paddingX: string,
  fontFamilyCompensation: string,
  additionalOffset = 0,
): string => {
  let paddingTop = paddingY;
  let paddingBottom = paddingY;
  const offset = parseInt(fontFamilyCompensation) || 0;

  const shiftUp = (top: string, bottom: string, offset: number) => {
    return [shift(top, `${-offset}`), shift(bottom, `${offset}`)];
  };

  if (fontSize === '16px' && offset) {
    [paddingTop, paddingBottom] = shiftUp(paddingTop, paddingBottom, offset);
  }
  if (additionalOffset) {
    [paddingTop, paddingBottom] = shiftUp(paddingTop, paddingBottom, additionalOffset);
  }

  return `${paddingTop} ${paddingX} ${paddingBottom}`;
};

export const buttonUseMixin = (
  btnBackground: string,
  btnBackgroundStart: string,
  btnBackgroundEnd: string,
  color: string,
  borderColor: string,
  borderBottomColor: string,
  borderWidth: string,
) => {
  const hasGradient = btnBackgroundStart !== btnBackgroundEnd;
  return css`
    background-color: ${hasGradient ? `initial` : btnBackground};
    background-image: ${hasGradient ? `linear-gradient(${btnBackgroundStart}, ${btnBackgroundEnd})` : `none`};
    color: ${color};
    border-color: ${borderColor};
    border-bottom-color: ${borderBottomColor};

    .${globalClassNames.arrowHelper} {
      box-shadow: ${borderWidth} 0 0 0 ${borderColor};
    }
  `;
};

export const buttonHoverMixin = (
  btnBackground: string,
  btnBackgroundStart: string,
  btnBackgroundEnd: string,
  borderColor: string,
  borderBottomColor: string,
  borderWidth: string,
) => {
  const hasGradient = btnBackgroundStart !== btnBackgroundEnd;
  return css`
    &:hover {
      background-color: ${hasGradient ? `initial` : btnBackground};
      background-image: ${hasGradient ? `linear-gradient(${btnBackgroundStart}, ${btnBackgroundEnd})` : `none`};
      border-color: ${borderColor};
      border-bottom-color: ${borderBottomColor};

      .${globalClassNames.arrowHelper} {
        box-shadow: ${borderWidth} 0 0 ${borderColor};
      }
    }
  `;
};

export const buttonActiveMixin = (
  btnBackground: string,
  btnShadow: string,
  borderColor: string,
  borderTopColor: string,
  borderWidth: string,
  arrowBgImage: string,
) => {
  return css`
    background-image: none;
    background-color: ${btnBackground};
    box-shadow: ${btnShadow};
    border-color: ${borderColor};
    border-top-color: ${borderTopColor};

    .${globalClassNames.arrowHelper} {
      box-shadow: ${borderWidth} 0 0 ${borderColor};

      &.${globalClassNames.arrowHelperTop} {
        background-image: ${arrowBgImage};
      }
    }
  `;
};

export const buttonSizeMixin = (
  fontSize: string,
  height: string, // todo: remove, in IE broke screenshots without height
  lineHeight: string,
  paddingX: string,
  paddingY: string,
  fontFamilyCompensation: string,
) => {
  return css`
    font-size: ${fontSize};
    box-sizing: border-box;
    height: ${height};
    padding: ${getBtnPadding(fontSize, paddingY, paddingX, fontFamilyCompensation)};
    line-height: ${lineHeight};
  `;
};

export const buttonSizeMixinIE11 = (
  fontSize: string,
  paddingX: string,
  paddingY: string,
  fontFamilyCompensation: string,
) => {
  return css`
    padding: ${getBtnPadding(fontSize, paddingY, paddingX, fontFamilyCompensation, 1)};
    line-height: normal;
  `;
};

export const arrowOutlineMixin = (
  insetWidth: string,
  outlineColor: string,
  outlineWidth: string,
  insetColor: string,
) => {
  return css`
    .${globalClassNames.arrowHelper} {
      &.${globalClassNames.arrowHelperTop} {
        box-shadow: inset -${insetWidth} ${insetWidth} 0 0 ${insetColor}, ${outlineWidth} 0 0 0 ${outlineColor} !important; // override :active styles
      }

      &.${globalClassNames.arrowHelperBottom} {
        box-shadow: inset -${insetWidth} -${insetWidth} 0 0 ${insetColor}, ${outlineWidth} 0 0 0 ${outlineColor} !important; // override :active styles
      }

      // don't hide inner outline
      // and keep the middle-line fix
      &:before {
        top: ${insetWidth};
        right: ${insetWidth};
        left: ${insetWidth};
      }
      &.${globalClassNames.arrowHelperBottom}:before {
        bottom: ${insetWidth};
      }
    }
  `;
};
