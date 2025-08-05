import React from 'react';

// NOTE: not really used anymore, only in Table, relying on a window call breaks SSR

const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : '100%',
    height: typeof window !== 'undefined' ? window.innerHeight : '100%',
  });
  React.useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
};

export default useWindowSize;
