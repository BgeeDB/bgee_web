import Element from '../../../Element/Element';
import classnames from '../../../../../helpers/classnames';
import ModalCardHeader from './ModalCardHeader';
import ModalCardBody from './ModalCardBody';
import ModalCardFooter from './ModalCardFooter';
import ModalCardTitle from './ModalCardTitle';

const ModalCard = ({ className, children, ...props }) => (
  <Element {...props} className={classnames('modal-card', className)}>
    {children}
  </Element>
);

ModalCard.Header = ModalCardHeader;

ModalCard.Body = ModalCardBody;

ModalCard.Footer = ModalCardFooter;

ModalCard.Title = ModalCardTitle;

ModalCard.propTypes = {};

ModalCard.defaultProps = {};

export default ModalCard;
