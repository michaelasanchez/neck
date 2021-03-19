import { findIndex, map, remove } from 'lodash';
import { useEffect, useState } from 'react';
import { IActiveNotification, NotificationType } from '../interfaces';

export const NOTIFICATION_TIMESPAN_DEFAULT = 5000;
export const NOTIFICATION_FADE_TIMESPAN_DEFAULT = 1000;

export const useNotification = () => {
  const [nextId, setNextId] = useState<number>(1);
  const [notifications, setNotifications] = useState<
    Array<IActiveNotification>
  >([]);

  useEffect(() => {
    if (notifications.length) {
      const interval = setInterval(() => {
        const now = new Date();

        const removed = remove(
          notifications,
          (n) =>
            !!n.dismissed ||
            (now.getTime() - n.init.getTime() > NOTIFICATION_TIMESPAN_DEFAULT &&
              !n.postponed)
        );

        let expired = 0;
        const updated = map(notifications, (n) => {
          if (
            now.getTime() - n.init.getTime() >
              NOTIFICATION_TIMESPAN_DEFAULT -
                NOTIFICATION_FADE_TIMESPAN_DEFAULT &&
            !n.postponed
          ) {
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

  const add = (
    message: string,
    type: NotificationType = NotificationType.Primary
  ) => {
    setNotifications([
      {
        init: new Date(),
        id: nextId,
        expiring: false,
        postponed: false,
        message,
        type,
      },
      ...notifications,
    ]);
    setNextId((id) => id + 1);
  };

  const dismiss = (notificationId: number) => {
    const index = findIndex(notifications, (n) => n.id == notificationId);
    if (index >= 0) {
      notifications[index].dismissed = true;
      notifications[index].expiring = true;
      setNotifications([...notifications]);
    }
  };

  const postpone = (notificationId: number, postpone: boolean = true) => {
    const index = findIndex(notifications, (n) => n.id == notificationId);
    if (index >= 0) {
      notifications[index].postponed = postpone;
      if (!postpone) {
        notifications[index].init = new Date();
      }
      setNotifications([...notifications]);
    }
  };

  return {
    notifications,
    addNotification: add,
    dismissNotification: dismiss,
    postponeNotification: postpone,
  };
};
