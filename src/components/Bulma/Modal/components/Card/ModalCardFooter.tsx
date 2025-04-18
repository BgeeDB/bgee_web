import classnames from '../../../../../helpers/classnames';
import Element from '../../../Element/Element';

const ModalCardFooter = ({ children, className, renderAs = 'footer', ...props }) => (
  <Element {...props} renderAs={renderAs} className={classnames('modal-card-foot', className)}>
    {children}
  </Element>
);

export default ModalCardFooter;
