import React, { AriaAttributes } from 'react';
import { func, shape, string } from 'prop-types';

import { CrossIcon } from '../../internal/icons/CrossIcon';
import { ZIndex } from '../../internal/ZIndex';
import { ThemeContext } from '../../lib/theming/ThemeContext';
import { Theme } from '../../lib/theming/Theme';
import { CommonProps, CommonWrapper, CommonWrapperRestProps } from '../../internal/CommonWrapper';
import { rootNode, TSetRootNode } from '../../lib/rootNode';
import { isTheme2022 } from '../../lib/theming/ThemeHelpers';
import { CloseButtonIcon } from '../../internal/CloseButtonIcon/CloseButtonIcon';

import { styles } from './ToastView.styles';
import { ToastDataTids } from './Toast';

export interface ToastViewProps extends Pick<AriaAttributes, 'aria-label'>, CommonProps {
  /**
   * Toast content
   */
  children?: string;
  /**
   * Adds action handling and close icon for toast
   */
  action?: {
    label: string;
    handler: () => void;
  } | null;
  onClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const TOAST_CLOSE_BUTTON_ARIA_LABEL = 'Закрыть уведомление';

@rootNode
export class ToastView extends React.Component<ToastViewProps> {
  public static propTypes = {
    /**
     * Adds action handling and close icon for toast
     */
    action: shape({
      label: string.isRequired,
      handler: func.isRequired,
    }),
    /**
     * Toast content
     */
    children: string.isRequired,
    onClose: func,
  };

  private theme!: Theme;
  private setRootNode!: TSetRootNode;

  public render() {
    return (
      <ThemeContext.Consumer>
        {(theme) => {
          this.theme = theme;
          return <CommonWrapper {...this.props}>{this.renderMain}</CommonWrapper>;
        }}
      </ThemeContext.Consumer>
    );
  }

  private renderMain = (props: CommonWrapperRestProps<ToastViewProps>) => {
    const { action, onClose, ...rest } = props;

    const link = action ? (
      <button
        aria-label={this.props['aria-label']}
        data-tid={ToastDataTids.action}
        className={styles.link(this.theme)}
        onClick={action.handler}
      >
        {action.label}
      </button>
    ) : null;

    let close = action ? (
      <span className={styles.closeWrapper(this.theme)}>
        <span
          aria-label={TOAST_CLOSE_BUTTON_ARIA_LABEL}
          data-tid={ToastDataTids.close}
          className={styles.close(this.theme)}
          onClick={onClose}
        >
          <CrossIcon />
        </span>
      </span>
    ) : null;

    if (isTheme2022(this.theme) && close) {
      close = (
        <span className={styles.closeWrapper(this.theme)}>
          <CloseButtonIcon
            aria-label={TOAST_CLOSE_BUTTON_ARIA_LABEL}
            data-tid={ToastDataTids.close}
            onClick={onClose}
            size={parseInt(this.theme.toastCloseSize)}
            side={40}
            color={this.theme.toastCloseColor}
            colorHover={this.theme.toastCloseHoverColor}
            tabbable={false}
          />
        </span>
      );
    }

    return (
      <ZIndex priority="Toast" className={styles.wrapper(this.theme)}>
        <div data-tid={ToastDataTids.toastView} {...rest} className={styles.root(this.theme)} ref={this.setRootNode}>
          <span>{this.props.children}</span>
          {link}
          {close}
        </div>
      </ZIndex>
    );
  };
}
