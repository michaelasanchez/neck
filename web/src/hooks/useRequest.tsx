import { useState } from 'react';
import { useNotificationContext } from '../components/App';
import { NotificationType } from './useNotification';


export const useRequest = (request: any) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>();

  const { addNotification } = useNotificationContext();

  const req = async (...params: any) => {
    try {
      const response = await request(...params);
      setData(response);

      return response;
    } catch ({ message }) {
      addNotification({ type: NotificationType.Danger, message: message ?? 'unknown error' });

      return null;
    }
  }

  return { req, data };
};
