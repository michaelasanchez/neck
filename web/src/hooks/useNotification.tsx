import { map, remove } from 'lodash';
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
  created: Date;
  expiring: boolean;
  type: NotificationType;
  message: string;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Array<Notification>>([]);

  useEffect(() => {
    if (notifications.length) {
      const interval = setInterval(() => {
        const now = new Date();

        console.log(`now: ${now} created: ${notifications[0].created} diff: ${notifications[0].created.getTime() - now.getTime()}`)
        const removed = remove(notifications, n => now.getTime() - n.created.getTime() > 5000);
        let expired = 0;

        const updated = map(notifications, n => {
          if (now.getTime() - n.created.getTime() <= 1000) {
            n.expiring = true;
            expired++;
          }
          return n;
        });
        
        if (removed.length > 0 || expired > 0) setNotifications([...updated]);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [notifications]);

  const addNotification = (newNotification: Notification) => {
    const created = new Date();
    created.setSeconds(created.getSeconds() + 5);
    setNotifications([{ created, expiring: false, ...newNotification }, ...notifications]);
  };

  return { notifications, addNotification };
};
