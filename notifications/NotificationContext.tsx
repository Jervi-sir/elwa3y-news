import { countUnreadNotifications } from './notificationsDB';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context object
export const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a ProfileProvider');
  }
  return context;
};

// Create a provider component for the context
export const NotificationProvider = ({ children }) => {
  const [UnreadCount, setUnreadCount] = useState(0);
  // Function to set unread count (e.g., after fetching from the database)
  const setUnreadNotifications = (count) => {
    setUnreadCount(count);
  };

  const decreaseUnreadCountBy = () => {
    setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
  };

  // Fetch unread count when the component is mounted
  useEffect(() => {
    countUnreadNotifications().then(e => {
      setUnreadCount(e);
		})
  }, []);

  return (
    <NotificationContext.Provider value={{ UnreadCount, setUnreadNotifications, decreaseUnreadCountBy }}>
      {children}
    </NotificationContext.Provider>
  );
};
