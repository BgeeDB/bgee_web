import React from 'react';
import { useLocation } from 'react-router';

/*
 * At component mount, will trigger window.scrollTo to the passed anchor
 */
const useAnchorAtMount = () => {
  const loc = useLocation();
  React.useEffect(() => {
    if (loc.hash !== '') {
      const anchor = loc.hash.replace('#', '');
      const element = document.getElementById(anchor);
      if (element) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth',
        });
      }
    }
  }, []);
  return null;
};

export default useAnchorAtMount;
