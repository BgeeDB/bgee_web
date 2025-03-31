import Element from '../../../Element/Element';
import classnames from '../../../../../helpers/classnames';

const ModalCardBody = ({ children, className, ...props }) => (
  <Element {...props} className={classnames('modal-card-body', className)}>
    {children}
  </Element>
);

ModalCardBody.defaultProps = {
  renderAs: 'section',
};

export default ModalCardBody;
