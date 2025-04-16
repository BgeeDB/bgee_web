import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';
import { normalizeStatus } from '../../../helpers/bulma';
import ButtonGroup from './ButtonGroup';

const Button = ({
  children,
  className,
  renderAs = 'button',
  color,
  size,
  outlined,
  inverted,
  submit,
  reset,
  fullwidth,
  status,
  loading,
  disabled,
  remove,
  isSelected,
  isStatic,
  rounded,
  onClick,
  light,
  text,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  renderAs?: string;
  color?: string;
  size?: string;
  outlined?: boolean;
  inverted?: boolean;
  submit?: boolean;
  reset?: boolean;
  fullwidth?: boolean;
  status?: string;
  loading?: boolean;
  disabled?: boolean;
  remove?: boolean;
  isSelected?: boolean;
  isStatic?: boolean;
  rounded?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  light?: boolean;
  text?: boolean;
  [key: string]: any;
}) => {
  let otherProps = {};
  if (submit) {
    otherProps = {
      type: 'submit',
      renderAs: 'button',
    };
  }
  if (reset) {
    otherProps = {
      type: 'reset',
      renderAs: 'button',
    };
  }

  if (isStatic) {
    otherProps = {
      renderAs: 'span',
    };
  }

  return (
    <Element
      tabIndex={disabled ? -1 : 0}
      renderAs={renderAs}
      {...props}
      {...otherProps}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={classnames(className, {
        [`is-${color}`]: color,
        [`is-${size}`]: size,
        'is-selected': isSelected,
        'is-static': isStatic,
        'is-light': light,
        'is-rounded': rounded,
        'is-outlined': outlined,
        'is-inverted': inverted,
        'is-fullwidth': fullwidth,
        [`is-${normalizeStatus(status)}`]: status,
        'is-loading': loading,
        'is-text': text,
        delete: remove,
        button: !remove,
      })}
    >
      {children}
    </Element>
  );
};

Button.Group = ButtonGroup;

export default Button;
