import { remove } from 'lodash';
import { useEffect, useState } from 'react';

export enum NotificationType {
  Primary = 'primary',
  Secondary = 'secondary',
  Success = 'success',
  Danger = 'danger',
  Warning = 'warning',
  Info = 'info',
  Light = 'light',
  Dark = 'dark',
}

export interface Notification {
  expire?: Date;
  type: NotificationType;
  message: string;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Array<Notification>>([]);

  useEffect(() => {
    if (notifications.length) {
      const interval = setInterval(() => {
        const now = new Date();
        remove(notifications, n => now > n.expire).length
          && setNotifications([...notifications]);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [notifications]);

  const addNotification = (newNotification: Notification) => {
    const expire = new Date();
    expire.setSeconds(expire.getSeconds() + 5);
    setNotifications([{ expire, ...newNotification }, ...notifications]);
  };

  return { notifications, addNotification };
};
