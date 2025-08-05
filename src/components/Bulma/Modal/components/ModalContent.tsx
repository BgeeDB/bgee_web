import classnames from '../../../../helpers/classnames';
import Element from '../../Element/Element';

/*
 * Custom modal content
 */
const ModalContent = ({ children, className, ...props }) => (
  <Element {...props} className={classnames('modal-content', className)}>
    {children}
  </Element>
);

export default ModalContent;
