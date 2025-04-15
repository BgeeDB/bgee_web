import React from 'react';

const useDetectClickOutside = (onClickOutside) => {
  const ref = React.useRef(null);

  const clickListener = React.useCallback(
    (e) => {
      if (ref && ref.current) {
        if (!ref.current.contains(e.target)) {
          onClickOutside?.(e);
        }
      }
    },
    [ref.current]
  );

  React.useEffect(() => {
    document.addEventListener('click', clickListener);
    return () => {
      document.removeEventListener('click', clickListener);
    };
  }, []);

  return ref;
};

export default useDetectClickOutside;
