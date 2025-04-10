import React from 'react';
import { useLocation } from 'react-router';

const ScrollTop = ({ children }) => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollTop;
