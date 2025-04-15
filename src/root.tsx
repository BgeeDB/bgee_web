import React from 'react';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router';

import type { Route } from './+types/root';
import './styles/global.scss';

import { ModalProvider } from './contexts/ModalContext';
import { APP_VERSION } from './helpers/constants';
import config from './config.json';
import Bulma from './components/Bulma';
import Alert from './components/Alert';
import Header from './components/Layout/Header/Header';
import Footer from './components/Layout/Footer/Footer';
import CookieMessage from './components/CookieMessage';
import { NotificationProvider, NotificationContext } from './contexts/NotificationsContext';
import { setAxiosAddNotif } from './api/prod/constant';

export const links: Route.LinksFunction = () => [
  // { rel: "preconnect", href: "https://fonts.googleapis.com" },
  // {
  //   rel: "preconnect",
  //   href: "https://fonts.gstatic.com",
  //   crossOrigin: "anonymous",
  // },
  // {
  //   rel: "stylesheet",
  //   href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  // },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { addNotification } = React.useContext(NotificationContext);
  const loc = useLocation();
  const URL_VERSION = APP_VERSION.replaceAll('.', '-');
  const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;
  const body = React.useMemo(
    () =>
      loc.pathname === '/' || loc.pathname === `${URL_ROOT}/` || loc.pathname === `${URL_ROOT}` ? (
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ModalProvider>
          <NotificationProvider>
            <div id="modal"></div>
            <div id="notifications"></div>
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
          </NotificationProvider>
        </ModalProvider>
        <ScrollRestoration />
        <Scripts />
        {/* TODO: the module below is at the origin of hydration errors */}
        <script type="module" src="/js/ionicons-5.5.4/ionicons.esm.js"></script>
        <script noModule src="/js/ionicons-5.5.4/ionicons.js"></script>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Error';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : message;
    details = error.data || details;
    // error.status === 404
    //   ? "The requested page could not be found."
    //   : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main style={{ textAlign: 'center' }}>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ width: '100%', padding: '1rem', overflowX: 'auto' }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
