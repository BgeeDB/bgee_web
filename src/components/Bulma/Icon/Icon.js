import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Icon = ({ size, color, className, align, text, ...props }) => (
  <Element
    {...props}
    className={classnames('icon', className, {
      [`is-${size}`]: size,
      [`is-${align}`]: align,
      [`has-text-${color}`]: color,
    })}
  />
);

Icon.defaultProps = {
  renderAs: 'span',
};

Icon.Text = Text;

export default Icon;
