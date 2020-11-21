import * as React from 'react';
import { useEffect, useState } from 'react';
import { Backdrop, Indicators } from '.';
import { useCookie } from '../hooks/useCookie';
import { Key, Mode, Note, Tuning } from '../models';
import { BaseRequest, AppOptions, IAppOptions } from '../shared';
import { ApiRequest } from '../shared/apirequest';
import { IndicatorsDisplayOptions, IndicatorsMode } from './Indicators';
import { Loading } from './Loading';
import { Neck } from './neck';
import { Ui } from './ui';

const USE_COOKIE = true;

const SHOW_INDICATORS = true;

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

const getDefaultIndicatorsOptions = (): IndicatorsDisplayOptions => {
  return {
    mode: IndicatorsMode.Chord,
  };
};

const App: React.FunctionComponent<AppProps> = ({}) => {
  const { getCookie, setCookie } = useCookie();

  const [options, setOptions] = useState<IAppOptions>();
  const [indicatorsOptions, setIndicatorsOptions] = useState<
    IndicatorsDisplayOptions
  >(getDefaultIndicatorsOptions());

  // Init
  useEffect(() => {
    const saved = getCookie('options');

    setOptions(
      USE_COOKIE && !!saved.length
        ? parseOptionsCookie(saved)
        : AppOptions.Default()
    );

    // DEBUG
    var weneedithere = new ApiRequest('ChordVariation').Get();

    // debugger;

  }, []);

  const handleSetOptions = (updated: Partial<IAppOptions>) => {
    const newOptions = {
      ...options,
      ...updated,
    };

    setCookie('options', JSON.stringify(newOptions));
    setOptions(newOptions);
  };

  const handleSetIndicatorsOptions = (
    updated: Partial<IndicatorsDisplayOptions>
  ) => {
    const newOptions = {
      ...indicatorsOptions,
      ...updated,
    };

    setIndicatorsOptions(newOptions);
  };

  if (options) {
    return (
      <>
        <main>
          <Backdrop options={options} />
          <div className="neck-container">
            <Neck options={options} />
          </div>
          {SHOW_INDICATORS && (
            <div className="indicators-container">
              <Indicators
                appOptions={options}
                displayOptions={indicatorsOptions}
              />
            </div>
          )}
        </main>
        <Ui
          appOptions={options}
          indicatorsOptions={indicatorsOptions}
          setOptions={handleSetOptions}
          setIndicatorsOptions={handleSetIndicatorsOptions}
        />
      </>
    );
  }

  return <Loading />;
};

export default App;
