import { map } from 'lodash';
import * as React from 'react';
import { Alert } from 'react-bootstrap';
import { useNotification, Notification } from '../../hooks/useNotification';

interface NotificationsProps {}

const Notifications: React.FunctionComponent<NotificationsProps> = (props) => {
  const { notifications, addNotification } = useNotification();
  return <>
  {map(notifications, (n: Notification, i: number) => <Alert key={i} variant={n.Type}>{n.Message}</Alert>)}
  </>;
};
