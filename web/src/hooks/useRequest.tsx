import { useState } from 'react';
import { useNotificationContext } from '../components/App';
import { NotificationType } from '../interfaces';
import { BaseResponse } from '../network';

export function useRequest<T>(
  request: (...params: Array<any>) => Promise<BaseResponse<T | Array<T>>>
) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>();

  const { addNotification } = useNotificationContext();

  const resp = async (...params: Array<any>) => {
    setLoading(true);

    try {
      const response = await request(...params);

      if (response.success) {
        setData(response.result);
      } else {
        throw new Error(response.message);
      }

      return response.result;
    } catch ({ message }) {
      addNotification(message ?? 'unknown error', NotificationType.Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { resp, data, loading };
}
