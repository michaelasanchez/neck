import { useState } from 'react';
import { AppOptions } from '../shared';

export const useAppOptions = () => {
  const [appOptions, setAppOptions] = useState<AppOptions>();

  const handleSetAppOptions = (updated: Partial<AppOptions>) => {
    setAppOptions({
      ...appOptions,
      ...updated,
    });
  };

  return { appOptions, setAppOptions: handleSetAppOptions };
};
