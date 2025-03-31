import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Section = ({ children, className, size, ...props }) => (
  <Element
    {...props}
    className={classnames('section', className, {
      [`is-${size}`]: size,
    })}
  >
    {children}
  </Element>
);

Section.defaultProps = {
  renderAs: 'section',
};

export default Section;
