import React from 'react';

const useToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = React.useState(initialState);

  // Define and memorize toggler function in case we pass down the comopnent,
  // This function change the boolean value to it's opposite value
  const toggle = React.useCallback(() => setState((s) => !s), []);
  const toTrue = React.useCallback(() => setState(true), []);
  const toFalse = React.useCallback(() => setState(false), []);

  return [state, { toggle, toTrue, toFalse }];
};

export default useToggle;
