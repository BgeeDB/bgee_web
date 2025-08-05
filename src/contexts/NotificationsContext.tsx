import React from 'react';
import ReactDOM from 'react-dom';
import useNotification from '../hooks/useNotifications';
import classnames from '../helpers/classnames';

interface Notification {
  id: string;
  timeout?: number;
  className?: string;
  children: React.ReactNode;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (data: Notification) => void;
  addNotifications: (arrNotif: Notification[]) => void;
  cleanNotifications: () => void;
  closeNotif: (id: string) => void;
}

// Initialize the context with default values to avoid undefined destructuring
const NotificationContext = React.createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  addNotifications: () => {},
  cleanNotifications: () => {},
  closeNotif: () => {},
});

const { Provider } = NotificationContext;

const Notifications = () => {
  const { notifications, closeNotif } = React.useContext(NotificationContext);
  const [isBrowser, setIsBrowser] = React.useState(false);

  React.useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (isBrowser) {
    return ReactDOM.createPortal(
      <>
        {notifications.map((c) => (
          <div key={c.id} className={classnames('notification', c.className)}>
            <button className="delete" type="button" onClick={() => closeNotif(c.id)} />
            {c.children}
          </div>
        ))}
      </>,
      document.querySelector('#notifications') as HTMLElement
    );
  }
  return <></>;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { notifications, addNotification, addNotifications, cleanNotifications, closeNotif } = useNotification();
  return (
    <Provider
      value={{
        notifications,
        addNotification,
        addNotifications,
        cleanNotifications,
        closeNotif,
      }}
    >
      <Notifications />
      {children}
    </Provider>
  );
};

export { NotificationContext, NotificationProvider };
