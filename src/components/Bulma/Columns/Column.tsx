import classnames from '../../../helpers/classnames';
import Element from '../Element/Element';

const Column = ({
  children,
  className,
  size,
  offset,
  narrow,
  mobile = {},
  tablet = {},
  desktop = {},
  widescreen = {},
  fullhd = {},
  touch = {},
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  size?: string | number;
  offset?: string | number;
  narrow?: boolean;
  mobile?: {
    size?: string | number;
    offset?: string | number;
    narrow?: boolean;
  };
  tablet?: {
    size?: string | number;
    offset?: string | number;
    narrow?: boolean;
  };
  desktop?: {
    size?: string | number;
    offset?: string | number;
    narrow?: boolean;
  };
  widescreen?: {
    size?: string | number;
    offset?: string | number;
    narrow?: boolean;
  };
  fullhd?: {
    size?: string | number;
    offset?: string | number;
    narrow?: boolean;
  };
  touch?: {
    size?: string | number;
    offset?: string | number;
    narrow?: boolean;
  };
  [key: string]: any;
}) => (
  <Element
    {...props}
    {...{ mobile, tablet, desktop, widescreen, fullhd, touch }}
    className={classnames(className, 'column', {
      [`is-${size}`]: size,
      [`is-${touch.size}-mobile`]: touch.size,
      [`is-${mobile.size}-mobile`]: mobile.size,
      [`is-${tablet.size}-tablet`]: tablet.size,
      [`is-${desktop.size}-desktop`]: desktop.size,
      [`is-${widescreen.size}-widescreen`]: widescreen.size,
      [`is-${fullhd.size}-fullhd`]: fullhd.size,
      [`is-offset-${touch.offset}-mobile`]: touch.offset,
      [`is-offset-${mobile.offset}-mobile`]: mobile.offset,
      [`is-offset-${tablet.offset}-tablet`]: tablet.offset,
      [`is-offset-${desktop.offset}-desktop`]: desktop.offset,
      [`is-offset-${widescreen.offset}-widescreen`]: widescreen.offset,
      [`is-offset-${fullhd.offset}-fullhd`]: fullhd.offset,
      [`is-offset-${offset}`]: offset,
      'is-narrow': narrow,
      'is-narrow-touch': touch.narrow,
      'is-narrow-mobile': mobile.narrow,
      'is-narrow-tablet': tablet.narrow,
      'is-narrow-desktop': desktop.narrow,
      'is-narrow-widescreen': widescreen.narrow,
      'is-narrow-fullhd': fullhd.narrow,
    })}
  >
    {children}
  </Element>
);

Column.defaultProps = {};

export default Column;
