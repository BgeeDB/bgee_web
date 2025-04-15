import classnames from '../../../helpers/classnames';
import Element from '../Element/Element';

const Footer = ({ className, renderAs = 'footer', ...props }) => (
  <Element {...props} renderAs={renderAs} className={classnames('footer', className)} />
);

export default Footer;
