import React from 'react';
import ReactDOM from 'react-dom';
import useModal from '../hooks/useModal';
import Element from '../components/Bulma/Element/Element';
import classnames from '../helpers/classnames';

const ModalContext = React.createContext();
const { Provider } = ModalContext;

const Modal = () => {
  const { modalContent, hideModal, modal, customOnClose } =
    React.useContext(ModalContext);

  if (modal)
    return ReactDOM.createPortal(
      <Element className={classnames('modal', 'is-active')}>
        <div
          role="presentation"
          className="modal-background"
          onClick={() => {
            if (customOnClose) {
              customOnClose();
            }
            hideModal();
          }}
        />
        {modalContent}
      </Element>,
      document.querySelector('#modal')
    );
  return null;
};
const ModalProvider = ({ children }) => {
  const {
    modal,
    handleModal,
    modalContent,
    hideModal,
    showModal,
    customOnClose,
  } = useModal();
  return (
    <Provider
      value={{
        modal,
        handleModal,
        modalContent,
        hideModal,
        showModal,
        customOnClose,
      }}
    >
      <Modal />
      {children}
    </Provider>
  );
};

export { ModalContext, ModalProvider };
