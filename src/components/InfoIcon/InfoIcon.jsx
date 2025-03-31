import React from 'react';
import Bulma from '../Bulma';

const InfoIcon = ({ title, content, tooltip }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        className="button is-ghost"
        onClick={() => setIsOpen(true)}
      >
        <span title={tooltip}>
          <Bulma.IonIcon name="information-circle" size="large" />
        </span>
      </button>
      <div className={`modal ${isOpen ? 'is-active' : ''}`}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div className="modal-background" onClick={() => setIsOpen(false)} />
        <div className="modal-card">
          {title && (
            <header className="modal-card-head">
              <p className="modal-card-title">{title}</p>
              {/* eslint-disable-next-line react/button-has-type */}
              <button
                className="delete"
                aria-label="close"
                onClick={() => setIsOpen(false)}
              />
            </header>
          )}
          <div className="modal-card-body">{content}</div>
        </div>
      </div>
    </>
  );
};

export default InfoIcon;
