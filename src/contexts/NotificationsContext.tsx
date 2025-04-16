import React from 'react';
import ReactDOM from 'react-dom';
import useNotification from '../hooks/useNotifications';
import classnames from '../helpers/classnames';

// Initialize the context with default values to avoid undefined destructuring
const NotificationContext = React.createContext({
  notifications: [],
  addNotification: (data: any) => {
    console.debug(`addNotification ${data}`);
  },
  addNotifications: () => {},
  cleanNotifications: () => {},
  closeNotif: (data: any) => {
    console.debug(`closeNotif ${data}`);
  },
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
        {notifications.map((c: any) => (
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

const NotificationProvider = ({ children }) => {
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
