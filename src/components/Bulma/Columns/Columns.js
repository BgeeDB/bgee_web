import BULMA from '../../../helpers/constants/bulma';
import classnames from '../../../helpers/classnames';
import Element from '../Element/Element';

const Columns = ({
  className,
  breakpoint,
  gap,
  multiline,
  centered,
  vCentered,
  variableGap,
  mobile = {},
  tablet = {},
  desktop = {},
  widescreen = {},
  fullhd = {},
  touch = {},
  ...props
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
        gap !== undefined ||
        [touch, mobile, tablet, desktop, widescreen, fullhd].find(
          (b) => b.gap !== undefined
        ),
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

Columns.defaultProps = {
  multiline: true,
};

export default Columns;
