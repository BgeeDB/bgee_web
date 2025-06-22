import React from 'react';

interface Notification {
  id: string;
  timeout?: number;
  className?: string;
  children: React.ReactNode;
}

interface TimeoutEntry {
  t: NodeJS.Timeout;
  moment: number;
  id: string;
}

let timeout: TimeoutEntry[] = [];
const TIMEOUT_NOTIF = 5000;
const CLEAR_INTERVAL = 5000;

const useNotifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const closeNotif = React.useCallback((id: string) => {
    const notif = timeout.splice(
      timeout.findIndex((t) => t.id === id),
      1
    )[0];
    if (notif) {
      clearTimeout(notif.t);
      setNotifications((n) => {
        const curr = [...n];
        curr.splice(
          curr.findIndex((c) => c.id === id),
          1
        );
        return curr;
      });
    }
  }, []);

  const addNotification = React.useCallback(
    (notif: Notification) => {
      setNotifications((n) => [...n, notif]);
      const t = setTimeout(() => {
        closeNotif(notif.id);
      }, notif.timeout || TIMEOUT_NOTIF);
      timeout.push({ t, moment: Date.now(), id: notif.id });
    },
    [closeNotif]
  );

  const addNotifications = React.useCallback(
    (arrNotif: Notification[]) => {
      setNotifications((n) => [...n, ...arrNotif]);
      arrNotif.forEach((notif) => {
        const t = setTimeout(() => {
          closeNotif(notif.id);
        }, notif.timeout || TIMEOUT_NOTIF);
        timeout.push({ t, moment: Date.now(), id: notif.id });
      });
    },
    [closeNotif]
  );

  React.useEffect(() => {
    const i = setInterval(() => {
      timeout.forEach((t) => {
        if (t.moment + TIMEOUT_NOTIF < Date.now()) closeNotif(t.id);
      });
    }, CLEAR_INTERVAL);
    return () => {
      if (i) clearInterval(i);
    };
  }, [closeNotif]);

  const cleanNotifications = React.useCallback(() => {
    setNotifications([]);
    timeout.forEach((t) => clearTimeout(t.t));
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
