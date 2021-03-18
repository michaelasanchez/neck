import { map } from 'lodash';
import * as React from 'react';
import { Alert } from 'react-bootstrap';
import { useNotificationContext } from '..';
import { Notification } from '../../hooks/useNotification';

interface NotificationsProps { }

export const Notifications: React.FunctionComponent<NotificationsProps> = (props) => {
  const { notifications } = useNotificationContext();

  return <div className="notifications">
    {map(notifications, (n: Notification, i: number) => {
      return <Alert key={i} variant={n.type} className={n.expiring === true ? 'fading' : ''}>{n.message}</Alert>
    })}
  </div>;
};
