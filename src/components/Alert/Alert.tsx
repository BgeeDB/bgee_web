import React from 'react';
import Bulma from '../Bulma';

const Alert = ({ type = 'warning', light = false, children, closable = false }) => {
  const [isClosed, setIsClosed] = React.useState(false);

  if (isClosed) return null;
  return (
    <Bulma.Notification color={type} light={light}>
      {closable && <button className="delete" onClick={() => setIsClosed(true)} />}
      {children}
    </Bulma.Notification>
  );
};

export default Alert;
