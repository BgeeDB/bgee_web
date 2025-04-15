import Element from '../../../Element/Element';
import classnames from '../../../../../helpers/classnames';

const ModalCardBody = ({ children, className, renderAs = 'section', ...props }) => (
  <Element {...props} renderAs={renderAs} className={classnames('modal-card-body', className)}>
    {children}
  </Element>
);

export default ModalCardBody;
