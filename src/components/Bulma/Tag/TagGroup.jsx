import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const TagGroup = ({ children, className, hasAddons, ...props }) => (
  <Element
    {...props}
    className={classnames('tags', className, {
      'has-addons': hasAddons,
    })}
  >
    {children}
  </Element>
);

TagGroup.defaultProps = {
  renderAs: 'span',
};

export default TagGroup;
