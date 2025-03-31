import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Title = ({
  children,
  className,
  size,
  subtitle,
  weight,
  spaced,
  heading,
  colorClassName,
  ...props
}) => (
  <Element
    {...props}
    className={classnames(
      className,
      {
        title: !subtitle && !heading,
        subtitle,
        heading,
        [`is-size-${size}`]: size,
        [`has-text-weight-${weight}`]: weight,
        'is-spaced': spaced && !subtitle,
      },
      colorClassName || 'has-text-primary'
    )}
  >
    {children}
  </Element>
);

Title.defaultProps = {
  renderAs: 'h1',
};

export default Title;
