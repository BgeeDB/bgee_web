import React from 'react';

const useModal = () => {
  const [modal, setModal] = React.useState(false);
  const [modalContent, setModalContent] = React.useState();
  const [customOnClose, setCustomOnClose] = React.useState();

  const handleModal = React.useCallback((content = false) => {
    setModal((m) => !m);
    if (content) {
      setModalContent(content);
    }
  }, []);

  const showModal = React.useCallback((content, opts) => {
    if (opts?.onClose) {
      setCustomOnClose(opts.onClose);
    }
    setModal(true);
    setModalContent(content);
  }, []);
  const hideModal = React.useCallback(() => {
    setModal(false);
    setModalContent(undefined);
    setCustomOnClose(undefined);
  }, []);

  return {
    modal,
    handleModal,
    modalContent,
    hideModal,
    showModal,
    customOnClose,
  };
};

export default useModal;
