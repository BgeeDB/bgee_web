import classnames from '../../../helpers/classnames';
import { normalizeAlign } from '../../../helpers/bulma';
import Element from '../Element/Element';

const ButtonGroup = ({ className, hasAddons, align, size, ...props }) => (
  <Element
    {...props}
    className={classnames('buttons', className, {
      'has-addons': hasAddons,
      [`is-${[normalizeAlign(align)]}`]: align,
      [`are-${size}`]: size,
    })}
  />
);

ButtonGroup.defaultProps = {
  renderAs: 'div',
};

export default ButtonGroup;
