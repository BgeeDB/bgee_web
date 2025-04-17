import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Icon = ({ size, color, className, align, renderAs = 'span', ...props }) => (
  <Element
    {...props}
    renderAs={renderAs}
    className={classnames('icon', className, {
      [`is-${size}`]: size,
      [`is-${align}`]: align,
      [`has-text-${color}`]: color,
    })}
  />
);
// Icon.Text = Text;

export default Icon;
