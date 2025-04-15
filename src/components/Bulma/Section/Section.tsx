import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Section = ({ children, className, size, renderAs = 'section', ...props }: any) => (
  <Element
    {...props}
    renderAs={renderAs}
    className={classnames('section', className, {
      [`is-${size}`]: size,
    })}
  >
    {children}
  </Element>
);

export default Section;
