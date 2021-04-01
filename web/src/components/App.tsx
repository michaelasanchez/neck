import * as React from 'react';
import { useRef } from 'react';
import { Backdrop, Indicators, IndicatorsMode } from '.';
import { useAppOptionsContext } from '..';
import { Loading } from './Loading';
import { Neck } from './neck';
import { ChordSlideIn, ScaleSlideIn, Ui } from './ui';
import { useNotification } from '../hooks';

import constate from 'constate';
import Draggable from 'react-draggable';

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
        <NotificationsProvider>
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
            <Draggable>
              <div
                // TODO: decide if this is "ui" or not.. (this smells)
                className={`slidein-container${
                  appOptions.leftHandUi ? ' left' : ''
                }`}
              >
                <ScaleSlideIn
                  collapse={appOptions.indicatorsMode !== IndicatorsMode.Scale}
                />
                <ChordSlideIn
                  collapse={appOptions.indicatorsMode !== IndicatorsMode.Chord}
                />
              </div>
            </Draggable>
          </main>
          <Ui />
        </NotificationsProvider>
      </>
    );
  }

  return <Loading errors={errors} />;
};

export default App;
