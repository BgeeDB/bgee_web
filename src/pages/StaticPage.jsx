import { Helmet } from 'react-helmet';
import staticBuilder from '../helpers/staticBuilder';
import ROUTES from '../paths/routes';
import config from '../config.json';

// TODO: REMOVE, not used anymore, replaced by react-router 7 SSR routes

const StaticPage = ({ location: { pathname } }) => (
  <>
    {ROUTES[pathname].meta && (
      <Helmet>
        <title>{ROUTES[pathname].meta.title}</title>
        <meta property="og:title" content={ROUTES[pathname].meta.title} />
        <meta name="decription" content={ROUTES[pathname].meta.description} />
        <meta property="og:description" content={ROUTES[pathname].meta.description} />
        <meta name="keywords" content={ROUTES[pathname].meta.keywords} />
        <meta property="og:url" content={`${config.genericDomain}${pathname}`} />
      </Helmet>
    )}
    {staticBuilder(ROUTES[pathname].source)}
  </>
);

export default StaticPage;
