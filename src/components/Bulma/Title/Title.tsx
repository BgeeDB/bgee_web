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
  renderAs = 'h1',
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  size?: string | number;
  subtitle?: boolean;
  weight?: string;
  spaced?: boolean;
  heading?: boolean;
  colorClassName?: string;
  renderAs?: any;
  [key: string]: any;
}) => (
  <Element
    {...props}
    renderAs={renderAs}
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

export default Title;
