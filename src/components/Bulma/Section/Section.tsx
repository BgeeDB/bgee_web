import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Section = ({
  children,
  className,
  size,
  renderAs = 'section',
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  renderAs?: string;
  [key: string]: any;
}) => (
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
