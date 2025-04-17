import classnames from '../../../helpers/classnames';
import Element from '../Element/Element';

const Footer = ({
  className,
  renderAs = 'footer',
  ...props
}: {
  className?: string;
  renderAs?: string;
  [key: string]: any;
}) => <Element {...props} renderAs={renderAs} className={classnames('footer', className)} />;

export default Footer;
