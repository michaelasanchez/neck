import * as React from 'react';
import { useRef } from 'react';
import { Backdrop, Indicators } from '.';
import { useAppOptionsContext } from '..';
import { Loading } from './Loading';
import { Neck } from './neck';
import { Ui } from './ui';

const SHOW_INDICATORS = true;

export interface AppProps {}

const App: React.FunctionComponent<AppProps> = () => {
  const { loading, errors } = useAppOptionsContext();

  const mainRef = useRef<HTMLDivElement>();

  if (!loading) {
    return (
      <>
        <main ref={mainRef}>
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
        <Ui />
      </>
    );
  }

  return <Loading errors={errors} />;
};

export default App;
