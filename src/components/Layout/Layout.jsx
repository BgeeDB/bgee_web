import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Alert from '../Alert';
import Bulma from '../Bulma';
import CookieMessage from '../CookieMessage';
import config from '../../config.json';
import { APP_VERSION } from '../../helpers/constants';
import { setAxiosAddNotif } from '../../api/prod/constant';
import { NotificationContext } from '../../contexts/NotificationsContext';

const Layout = ({ children }) => {
  const { addNotification } = React.useContext(NotificationContext);
  const loc = useLocation();
  const URL_VERSION = APP_VERSION.replaceAll('.', '-');
  const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;
  const body = React.useMemo(
    () =>
      loc.pathname === '/' || loc.pathname === `${URL_ROOT}/`  || loc.pathname === `${URL_ROOT}` ? (
        <>{children}</>
      ) : (
        <Bulma.Section className="is-flex-grow-1">{children}</Bulma.Section>
      ),
    [loc]
  );

  React.useEffect(() => {
    if (loc.hash !== '') {
      /* console.debug(loc.hash); */
      document.getElementById(loc.hash.replace('#', ''))?.scrollIntoView();
    }
  }, [loc.hash]);
  React.useEffect(() => {
    setAxiosAddNotif(addNotification);
    return () => {
      setAxiosAddNotif(null);
    };
  }, []);
  return (
    <div className="layout">
      <Header />
      {config.archive && (
        <Alert type="danger" light>
          <span>
            {`This is an archived version of Bgee (version ${APP_VERSION})`}
            <a className="internal-link ml-2" href={config.prodDomain}>
              <strong>Access latest version of Bgee</strong>
            </a>
          </span>
        </Alert>
      )}
      {config.globalMessageInfo && (
        <Alert type="warning" light>
          <span>{config.globalMessageInfo}</span>
        </Alert>
      )}
      {body}
      <Footer />
      <CookieMessage />
    </div>
  );
};

export default Layout;
