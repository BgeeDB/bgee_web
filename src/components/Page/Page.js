import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import ROUTES from '../../routes/routes';
import PATHS from '../../routes/paths';
import config from '../../config.json';

class Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error('ERROR (getDerivedStateFromError) :', error);
    // Update state so the next render will show the fallback UI.
    return { hasError: { name: error.name, message: error.message } };
  }

  componentDidCatch(error) {
    // You can also log the error to an error reporting service
    // trigger ga error
    console.debug(error);
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <Redirect
          push
          to={{
            pathname: PATHS.ERROR,
            state: { error: hasError },
          }}
        />
      );
    }

    const { Component, title, ...props } = this.props;
    const meta = ROUTES?.[props.location.pathname]?.meta;

    return (
      <>
        {!meta && (title || ROUTES[props.location.pathname]?.title) && (
          <Helmet>
            <title>{title || ROUTES[props.location.pathname].title}</title>
          </Helmet>
        )}
        {meta && (
          <Helmet>
            {meta.title && <title>{meta.title}</title>}
            {meta.title && <meta property='og:title' content={meta.title} />}
            {meta.description && (
              <meta name="description" content={meta.description} />
            )}
            {meta.description && (
              <meta property='og:description' content={meta.description} />
            )}
            {meta.keywords && <meta name="keywords" content={meta.keywords} />}
            <meta property="og:url" content={`${config.genericDomain}${props.location.pathname}`} />
          </Helmet>
        )}
        <Component {...props} />
      </>
    );
  }
}
export default Page;
