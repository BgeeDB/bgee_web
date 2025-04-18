import Element from '../../../Element/Element';
import classnames from '../../../../../helpers/classnames';

const ModalCardHeader = ({ children, className, renderAs = 'header', ...props }) => (
  <Element {...props} renderAs={renderAs} className={classnames('modal-card-head', className)}>
    {children}
  </Element>
);

export default ModalCardHeader;
