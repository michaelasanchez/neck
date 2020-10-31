import * as React from 'react';
import { useEffect, useState } from 'react';

import { Backdrop, Indicators } from '.';
import { useCookie } from '../hooks/useCookie';
import { Key, Mode, Note, Tuning } from '../models';
import { AppOptions, IAppOptions } from '../shared';
import { Loading } from './Loading';
import { Neck } from './neck';
import { Ui } from './ui';

const USE_COOKIE = true;

export interface AppProps {
  defaultKey?: Key;
  defaultTuning?: Tuning;
  defaultMode?: Mode;
}

const parseOptionsCookie = (cookieString: string): IAppOptions => {
  let parsed = JSON.parse(cookieString);

  const rootNote = new Note(parsed.key._tonic.base, parsed.key._tonic.suffix);

  parsed.key = new Key(rootNote);
  parsed.mode = new Mode(parsed.mode.name, parsed.mode.pattern);
  parsed.tuning = new Tuning(parsed.tuning.name, parsed.tuning.offsets);

  return parsed;
};

const App: React.FunctionComponent<AppProps> = ({}) => {
  const { getCookie, setCookie } = useCookie();

  const [options, setOptions] = useState<IAppOptions>();

  useEffect(() => {
    const saved = getCookie('options');

    setOptions(
      USE_COOKIE && !!saved.length
        ? parseOptionsCookie(saved)
        : AppOptions.Default()
    );
  }, []);

  const handleSetOptions = (updated: Partial<IAppOptions>) => {
    const newOptions = {
      ...options,
      ...updated,
    };

    setCookie('options', JSON.stringify(newOptions));
    setOptions(newOptions);
  };

  if (options) {
    return (
      <>
        <main>
          <Backdrop options={options} />
          <div className="neck-container">
            <Neck options={options} />
          </div>
          <div className="indicators-container">
            <Indicators options={options} />
          </div>
        </main>
        <Ui options={options} setOptions={handleSetOptions} />
      </>
    );
  }

  return <Loading />;
};

export default App;
