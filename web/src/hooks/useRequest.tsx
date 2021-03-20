import { useState } from 'react';
import { useNotificationContext } from '../components/App';
import { NotificationType } from '../interfaces';
import { BaseResponse } from '../network';

export interface IUseRequest<T> {
  req: (...params: Array<any>) => Promise<T>,
  data: T,
  loading: boolean,
}

export function useRequest<T>(
  request: (...params: Array<any>) => Promise<BaseResponse<T>>
) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>();

  const { addNotification } = useNotificationContext();

  const req = async (...params: Array<any>) => {
    setLoading(true);

    try {
      const response = await request(...params);

      if (response.success) {
        setData(response.result);
      } else {
        if (response.code >= 400) {
          throw new Error(response.message);
        }
      }

      if (response.message) {
        addNotification(
          response.message,
          response.code >= 300
            ? NotificationType.Warning
            : NotificationType.Info
        );
      }

      return response.result;
    } catch ({ message }) {
      addNotification(message ?? 'unknown error', NotificationType.Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { req, data, loading } as IUseRequest<T>;
}
