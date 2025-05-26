import classnames from '../../../helpers/classnames';
import Element from '../Element/Element';

const Footer = ({ className, ...props }) => (
  <Element {...props} className={classnames('footer', className)} />
);

Footer.defaultProps = {
  renderAs: 'footer',
};

export default Footer;
