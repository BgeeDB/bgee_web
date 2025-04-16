import BULMA from '../../../helpers/constants/bulma';
import classnames from '../../../helpers/classnames';
import Element from '../Element/Element';

const Columns = ({
  className,
  breakpoint,
  gap,
  multiline = true,
  centered,
  vCentered,
  mobile = {},
  tablet = {},
  desktop = {},
  widescreen = {},
  fullhd = {},
  touch = {},
  ...props
}: {
  className?: string;
  breakpoint?: string;
  gap?: string | number;
  multiline?: boolean;
  centered?: boolean;
  vCentered?: boolean;
  mobile?: {
    gap?: string | number;
  };
  tablet?: {
    gap?: string | number;
  };
  desktop?: {
    gap?: string | number;
  };
  widescreen?: {
    gap?: string | number;
  };
  fullhd?: {
    gap?: string | number;
  };
  touch?: {
    gap?: string | number;
  };
  [key: string]: any;
}) => (
  <Element
    {...props}
    {...{ mobile, tablet, desktop, widescreen, fullhd, touch }}
    className={classnames(className, 'columns', {
      [`is-${breakpoint}`]: breakpoint,
      [`is-${gap}`]: gap !== undefined,
      'is-multiline': multiline,
      'is-centered': centered,
      'is-vcentered': vCentered,
      'is-variable':
        gap !== undefined || [touch, mobile, tablet, desktop, widescreen, fullhd].find((b) => b.gap !== undefined),
      [`is-${touch.gap}-touch`]: touch.gap !== undefined,
      [`is-${mobile.gap}-mobile`]: mobile.gap !== undefined,
      [`is-${tablet.gap}-tablet`]: tablet.gap !== undefined,
      [`is-${desktop.gap}-desktop`]: desktop.gap !== undefined,
      [`is-${widescreen.gap}-widescreen`]: widescreen.gap !== undefined,
      [`is-${fullhd.gap}-fullhd`]: fullhd.gap !== undefined,
    })}
  />
);

Columns.CONSTANTS = BULMA.SIZES;

export default Columns;
