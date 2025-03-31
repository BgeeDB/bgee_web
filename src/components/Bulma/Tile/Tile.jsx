import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Tile = ({
  children,
  className,
  kind,
  vertical,
  size,
  color,
  ...props
}) => (
  <Element
    {...props}
    className={classnames('tile', className, {
      [`is-${kind}`]: kind,
      [`is-${size}`]: size,
      [`is-${color}`]: color,
      'is-vertical': vertical,
    })}
  >
    {children}
  </Element>
);

export default Tile;
