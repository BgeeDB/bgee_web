import classnames from '../../../../../helpers/classnames';
import Element from '../../../Element/Element';

const ModalCardFooter = ({ children, className, ...props }) => (
  <Element {...props} className={classnames('modal-card-foot', className)}>
    {children}
  </Element>
);

ModalCardFooter.defaultProps = {
  renderAs: 'footer',
};

export default ModalCardFooter;
