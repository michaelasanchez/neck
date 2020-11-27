import { each } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useCookie } from '../hooks/useCookie';
import {
  ChordModifier,
  ChordVariation,
  Key,
  Mode,
  Note,
  NoteSuffix,
  NoteValue,
  Tuning,
} from '../models';
import { AppOptions, IAppOptions } from '../shared';
import { ApiRequest } from '../shared/apirequest';
import { IndicatorsDisplayOptions, IndicatorsMode } from './Indicators';
import { Loading } from './Loading';
import { Ui, UiOptions } from './ui';

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
  parsed.tuning = new Tuning(parsed.tuning.Label, parsed.tuning.Offsets);

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
  const [
    indicatorsOptions,
    setIndicatorsOptions,
  ] = useState<IndicatorsDisplayOptions>(getDefaultIndicatorsOptions());
  const [uiOptions, setUiOptions] = useState<UiOptions>();

  // Init
  useEffect(() => {
    const saved = getCookie('options');

    setOptions(
      USE_COOKIE && !!saved.length
        ? parseOptionsCookie(saved)
        : AppOptions.Default()
    );

    // DEBUG
    var tunings = new ApiRequest('Tuning').Get().then((data) => {
      console.log('TUNINGS', data);
    });
    var variations = new ApiRequest('ChordVariation', 'GenerateRange')
      .Post({
        // chordid: '8C99611C-6A9B-4267-C8CA-08D891C3370D',
        chord: {
          root: {
            base: NoteValue.F,
            suffix: NoteSuffix.Sharp.toString(),
          },
          modifier: ChordModifier.Major,
        },
        tuningid: 'D2FD35C9-A44E-4E2A-97AC-08D891C3371E',
      })
      .then((data: any) => {
        const newVariations: ChordVariation[] = [];
        each(data, (v) => {
          newVariations.push(
            new ChordVariation(v.formation.positions, v.chord, v.tuning)
          );
        });
        handleSetUiOptions({ variations: newVariations });
      });
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
    setIndicatorsOptions({
      ...indicatorsOptions,
      ...updated,
    });
  };

  const handleSetUiOptions = (updated: Partial<UiOptions>) => {
    setUiOptions({
      ...uiOptions,
      ...updated,
    });
  };

  if (options) {
    return (
      <>
        <main>
          {/* <Backdrop options={options} /> */}
          <div className="neck-container">
            {/* <Neck options={options} /> */}
          </div>
          {SHOW_INDICATORS && (
            <div className="indicators-container">
              {/* <Indicators
                appOptions={options}
                displayOptions={indicatorsOptions}
              /> */}
            </div>
          )}
        </main>
        <Ui
          appOptions={options}
          indicatorsOptions={indicatorsOptions}
          setOptions={handleSetOptions}
          setIndicatorsOptions={handleSetIndicatorsOptions}
          uiOptions={uiOptions}
        />
      </>
    );
  }

  return <Loading />;
};

export default App;
