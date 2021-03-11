import { useState } from 'react';

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
  Type: NotificationType;
  Message: string;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Array<Notification>>();

  const addNotification = (newNotification: Notification) => {
    notifications.push(newNotification);
    setNotifications(notifications);
  };

  return { notifications, addNotification };
};
