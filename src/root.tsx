import React from 'react';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router';

import type { Route } from './+types/root';
import { ModalProvider } from './contexts/ModalContext';
import { APP_VERSION, URL_ROOT } from './helpers/constants';
import config from './config.json';
import Bulma from './components/Bulma';
import Alert from './components/Alert';
import Header from './components/Layout/Header/Header';
import Footer from './components/Layout/Footer/Footer';
import CookieMessage from './components/CookieMessage';
import { NotificationProvider, NotificationContext } from './contexts/NotificationsContext';
import { setAxiosAddNotif } from './api/prod/constant';
import './styles/global.scss';

/**
 * All of the app layout goes here
 */
export function Layout({ children }: { children: React.ReactNode }) {
  const { addNotification } = React.useContext(NotificationContext);
  const loc = useLocation();

  const body = React.useMemo(
    () =>
      loc.pathname === '/' || loc.pathname === `${URL_ROOT}/` || loc.pathname === `${URL_ROOT}` ? (
        <>{children}</>
      ) : (
        <Bulma.Section className="is-flex-grow-1">{children}</Bulma.Section>
      ),
    [loc, children]
  );

  // TODO: this might be causing unwanted scrolls to top when the page is loaded
  // React.useEffect(() => {
  //   if (loc.hash !== '') {
  //     /* console.debug(loc.hash); */
  //     document.getElementById(loc.hash.replace('#', ''))?.scrollIntoView();
  //   }
  // }, [loc.hash]);

  React.useEffect(() => {
    setAxiosAddNotif(addNotification);
    return () => {
      setAxiosAddNotif(null);
    };
  }, []);

  // Initialize Matomo analytics on client side only
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const _mtm = ((window as any)._mtm = (window as any)._mtm || []);
      _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });
      // Only load script if not already loaded
      if (!document.querySelector('script[src*="matomo.sib.swiss"]')) {
        const d = document;
        const g = d.createElement('script');
        const s = d.getElementsByTagName('script')[0];
        g.integrity =
          'sha384-c84c02a9be5900a7b0364317a1b0b26b455d1cdd35e954199d51c89d61d6ca745f72c8bf90b57868308110b8c57a5e44';
        g.crossOrigin = 'anonymous';
        g.async = true;
        g.src = 'https://matomo.sib.swiss/js/container_F5WPJc2X.js';
        if (s && s.parentNode) s.parentNode.insertBefore(g, s);
      } else {
        console.log('Matomo script already loaded');
      }
    }
  }, []);

  // Track page views on route changes for SPA navigation
  React.useEffect(() => {
    (window as any)._mtm.push({
      event: 'mtm.PageView',
      url: window.location.href,
      title: document.title,
    });
  }, [loc.pathname]);

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
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

/**
 * Displaying error done here
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Something wrong happened!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404 not found. We could not understand your query.' : message;
    details =
      error.status === 404
        ? error.data || 'Page not found.'
        : 'Try again later or contact the administrator through the &quot;Contact us&quot; support menu link.';
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

// export const links: Route.LinksFunction = () => [
//   { rel: "preconnect", href: "https://fonts.googleapis.com" },
// ];
