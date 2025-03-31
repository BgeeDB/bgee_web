import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';
import TagGroup from './TagGroup';

const Tag = ({
  children,
  className,
  color,
  size,
  rounded,
  remove,
  ...props
}) => (
  <Element
    {...props}
    className={classnames('tag', className, {
      [`is-${size}`]: size,
      [`is-${color}`]: color,
      'is-rounded': rounded,
      'is-delete': remove,
    })}
  >
    {!remove && children}
  </Element>
);

Tag.Group = TagGroup;

Tag.defaultProps = {
  renderAs: 'span',
};

export default Tag;
