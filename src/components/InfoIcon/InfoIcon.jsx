import React from 'react';
import { Info } from 'lucide-react';

const InfoIcon = ({ title, content, tooltip }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button type="button" className="button is-ghost" onClick={() => setIsOpen(true)}>
        <span title={tooltip}>
          <Info />
        </span>
      </button>
      <div className={`modal ${isOpen ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setIsOpen(false)} />
        <div className="modal-card">
          {title && (
            <header className="modal-card-head">
              <p className="modal-card-title">{title}</p>
              <button className="delete" aria-label="close" onClick={() => setIsOpen(false)} />
            </header>
          )}
          <div className="modal-card-body">{content}</div>
        </div>
      </div>
    </>
  );
};

export default InfoIcon;
