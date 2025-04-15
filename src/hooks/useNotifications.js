import React from 'react';

let timeout = [];
const TIMEOUT_NOTIF = 5000;
const CLEAR_INTERVAL = 5000;

const useNotifications = () => {
  const [notifications, setNotifications] = React.useState([]);

  const closeNotif = React.useCallback((id) => {
    const notif = timeout.splice(
      timeout.findIndex((t) => t.id === id),
      1
    );
    clearTimeout(notif.t);
    setNotifications((n) => {
      const curr = [...n];
      curr.splice(
        curr.findIndex((c) => c.id === id),
        1
      );
      return curr;
    });
  }, []);
  const addNotification = React.useCallback((notif) => {
    setNotifications((n) => [...n, notif]);
    const t = setTimeout(() => {
      closeNotif(notif.id);
    }, notif.timeout || TIMEOUT_NOTIF);
    timeout.push({ t, moment: Date.now(), id: notif.id });
  }, []);
  const addNotifications = React.useCallback((arrNotif) => {
    setNotifications((n) => [...n, ...arrNotif]);
    arrNotif.forEach((notif) => {
      const t = setTimeout(() => {
        closeNotif(notif.id);
      }, notif.timeout || TIMEOUT_NOTIF);
      timeout.push({ t, moment: Date.now(), id: notif.id });
    });
  }, []);
  React.useEffect(() => {
    const i = setInterval(() => {
      timeout.forEach((t) => {
        if (t.moment + TIMEOUT_NOTIF < Date.now()) closeNotif(t.id);
      });
    }, CLEAR_INTERVAL);
    return () => {
      if (i) clearInterval(i);
    };
  }, []);

  const cleanNotifications = React.useCallback(() => {
    setNotifications([]);
    timeout.forEach((t) => clearTimeout(t));
    timeout = [];
  }, []);

  return {
    notifications,
    addNotification,
    addNotifications,
    cleanNotifications,
    closeNotif,
  };
};

export default useNotifications;
