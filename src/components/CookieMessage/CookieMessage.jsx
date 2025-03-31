import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {Link} from "react-router";
import PATHS from '../../paths/paths';

const COOKIE_KEY = 'BGEE-PP';

let container;

const CookieMessage = () => {
  const [portalContainer, setPortalContainer] = useState();

  const acceptMessage = React.useCallback(() => {
    window.localStorage.setItem(COOKIE_KEY, Number(true).toString());
    setPortalContainer(undefined);
    if (container) container.parentNode.removeChild(container);
  }, []);

  useEffect(() => {
    const status = window.localStorage.getItem(COOKIE_KEY);

    if (!(status && Boolean(parseInt(status, 10)))) {
      const doc = document;
      container = doc.createElement('div');
      container.setAttribute('class', 'cookie-message');
      doc.body.appendChild(container);
      setPortalContainer(container);
    }

    return () => {
      if (container) container.parentNode.removeChild(container);
    };
  }, []);

  if (!portalContainer) {
    return null;
  }
  return ReactDOM.createPortal(
    <>
      <div className="left">
        <span className="privacycolor">
          This website requires cookies, and limited processing of your personal
          data in order to function. By using the site you are agreeing to this
          as outlined in our{' '}
          <Link to={PATHS.ABOUT.PRIVACY_POLICY} className=" is-underlined color-white">
            privacy notice
          </Link>
          .
        </span>
      </div>
      <div className="right">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <a className="is-underlined color-white" onClick={acceptMessage}>
          Do not show this banner again
        </a>
      </div>
    </>,
    portalContainer
  );
};

export default CookieMessage;
