import { map } from 'lodash';
import * as React from 'react';
import { Alert } from 'react-bootstrap';
import { useNotificationContext } from '..';
import { IActiveNotification } from '../../interfaces';

interface NotificationsProps {}

export const Notifications: React.FunctionComponent<NotificationsProps> = () => {
  const {
    notifications,
    dismissNotification,
    postponeNotification,
  } = useNotificationContext();

  return (
    <div className="notifications">
      {map(notifications, (n: IActiveNotification, i: number) => (
        <Alert
          key={n.id}
          variant={n.type}
          className={n.expiring === true ? 'fading' : ''}
          dismissible={true}
          onMouseOver={() => postponeNotification(n.id)}
          onMouseOut={() => postponeNotification(n.id, false)}
          onClose={() => dismissNotification(n.id)}
          style={{ transform: `translate(0px, ${i * 70}px)` }}
        >
          <span>{n.message}</span>
        </Alert>
      ))}
    </div>
  );
};
