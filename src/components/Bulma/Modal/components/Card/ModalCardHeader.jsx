import Element from '../../../Element/Element';
import classnames from '../../../../../helpers/classnames';

const ModalCardHeader = ({ children, className, showClose, ...props }) => (
  <Element {...props} className={classnames('modal-card-head', className)}>
    {children}
  </Element>
);

ModalCardHeader.defaultProps = {
  showClose: true,
  renderAs: 'header',
};

export default ModalCardHeader;
