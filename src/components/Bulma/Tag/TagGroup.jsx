import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const TagGroup = ({ children, className, hasAddons, renderAs = 'span', ...props }) => (
  <Element
    {...props}
    renderAs={renderAs}
    className={classnames('tags', className, {
      'has-addons': hasAddons,
    })}
  >
    {children}
  </Element>
);

export default TagGroup;
