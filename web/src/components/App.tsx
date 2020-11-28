import { each } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Backdrop, Indicators } from '.';
import { useCookie } from '../hooks/useCookie';
import {
  Chord,
  ChordModifier,
  ChordVariation,
  Key,
  Mode,
  Note,
  NoteValue,
  Tuning,
} from '../models';
import { ChordVariationApi } from '../network/ChordVariationApi';
import { InstrumentApi } from '../network/InstrumentApi';
import { AppOptions, IAppOptions } from '../shared';
import { IndicatorsDisplayOptions, IndicatorsMode } from './Indicators';
import { Loading } from './Loading';
import { Neck } from './neck';
import { Ui, UiOptions } from './ui';

const USE_COOKIE = true;

const SHOW_INDICATORS = true;

const CONVERT_VARIATION_TO_CHORD_FORM = true;

export interface AppProps {
  defaultKey?: Key;
  defaultTuning?: Tuning;
  defaultMode?: Mode;
}

const parseOptionsCookie = (cookieString: string): IAppOptions => {
  let parsed = JSON.parse(cookieString);

  console.log('PARSED', parsed);

  const rootNote = new Note(parsed.key._tonic.base, parsed.key._tonic.suffix);

  parsed.key = new Key(rootNote);
  parsed.mode = new Mode(parsed.mode.name, parsed.mode.pattern);
  parsed.tuning = new Tuning(parsed.tuning.Label, parsed.tuning.Offsets);

  return parsed;
};

const serializeOptionsCookie = (options: IAppOptions): string => {
  options.tuning = {
    Label: options.tuning.Label,
    Offsets: options.tuning.Offsets,
  } as Tuning;
  return JSON.stringify(options);
};

const DefaultIndicatorsOptions = {
  mode: IndicatorsMode.Chord,
};

const App: React.FunctionComponent<AppProps> = ({}) => {
  const { getCookie, setCookie } = useCookie();

  const [options, setOptions] = useState<IAppOptions>();
  const [
    indicatorsOptions,
    setIndicatorsOptions,
  ] = useState<IndicatorsDisplayOptions>(DefaultIndicatorsOptions);
  const [uiOptions, setUiOptions] = useState<UiOptions>();

  const mainRef = useRef<HTMLDivElement>();

  // Init
  useEffect(() => {
    const saved = getCookie('options');

    const options =
      USE_COOKIE && !!saved.length
        ? parseOptionsCookie(saved)
        : AppOptions.Default();

    loadOptions(options);
  }, []);

  const loadOptions = (options: IAppOptions) => {
    // DEBUG
    const chord = {
      root: {
        base: NoteValue.G,
        // suffix: NoteSuffix.Sharp,
      },
      modifier: ChordModifier.Major,
    } as Partial<Chord>;

    if (options.instrumentId) {
      let instrumentRequest = new InstrumentApi()
        .GetById(options.instrumentId)
        .then((instrument) => {
          // TODO: figure out default/saved tuning
          const tuning = instrument.DefaultTuning;

          new ChordVariationApi()
            .GenerateRange({
              chord,
              tuningId: tuning.Id,
              range: options.numFrets,
            })
            .then((response: any) => {
              const newVariations: ChordVariation[] = [];
              each(response, (v) => {
                newVariations.push(
                  new ChordVariation(
                    v.Formation.Positions,
                    v.Chord,
                    v.Tuning,
                    CONVERT_VARIATION_TO_CHORD_FORM
                  )
                );
              });
              handleSetUiOptions({ variations: newVariations });
              handleSetOptions({
                ...options,
                tuning,
                tuningId: tuning.Id,
                instrumentId: instrument.Id,
              });
            });
        });
    }
  };

  const handleSetOptions = (updated: Partial<IAppOptions>) => {
    const newOptions = {
      ...options,
      ...updated,
    };

    setCookie('options', serializeOptionsCookie(newOptions));
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
        <main ref={mainRef}>
          <Backdrop options={options} />
          <div className="neck-container">
            <Neck options={options} />
          </div>
          {SHOW_INDICATORS && (
            <div className="indicators-container">
              <Indicators
                appOptions={options}
                displayOptions={indicatorsOptions}
                mainRef={mainRef}
              />
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
