import constate from 'constate';
import * as React from 'react';
import { useRef } from 'react';
import { Backdrop } from '.';
import { useAppOptionsContext } from '..';
import { useNotification } from '../hooks';
import { Loading } from './Loading';
import { Neck } from './neck';
import { Ui } from './ui';
import { Indicators } from './ui/indicators';

const SHOW_INDICATORS = true;

export interface AppProps {}

export const [NotificationsProvider, useNotificationContext] = constate(
  useNotification
);

const App: React.FunctionComponent<AppProps> = () => {
  const { loading, errors, appOptions } = useAppOptionsContext();

  const mainRef = useRef<HTMLDivElement>();

  if (!loading) {
    return (
      <>
        <main ref={mainRef} className={appOptions.leftHandMode ? 'left' : ''}>
          <Backdrop />
          <div className="neck-container">
            <Neck />
          </div>
          {SHOW_INDICATORS && (
            <div className="indicators-container">
              <Indicators mainRef={mainRef} />
            </div>
          )}
        </main>
        <NotificationsProvider>
          <Ui />
        </NotificationsProvider>
      </>
    );
  }

  return <Loading errors={errors} />;
};

export default App;
