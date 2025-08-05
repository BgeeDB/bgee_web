import ModalContent from './components/ModalContent';
import ModalCardHeader from './components/Card/ModalCardHeader';
import ModalCardFooter from './components/Card/ModalCardFooter';
import ModalCardBody from './components/Card/ModalCardBody';
import ModalCardTitle from './components/Card/ModalCardTitle';
import ModalCard from './components/Card';

const Modal = {
  Content: ModalContent,
  Card: {
    Wrapper: ModalCard,
    Header: ModalCardHeader,
    Title: ModalCardTitle,
    Body: ModalCardBody,
    Footer: ModalCardFooter,
  },
};

export default Modal;
