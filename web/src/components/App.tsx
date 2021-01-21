import { filter, isArray } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Backdrop, Indicators } from '.';
import { useCookie } from '../hooks/useCookie';
import { Chord, ChordModifier, Instrument, Key, Mode, Note, NoteSuffix, NoteValue, Scale, ScaleType } from '../models';
import Cookie from '../models/Cookie';
import { ChordApi } from '../network/ChordApi';
import { InstrumentApi } from '../network/InstrumentApi';
import { ScaleApi } from '../network/ScaleApi';
import { AppOptions, NoteUtils } from '../shared';
import { IndicatorsMode } from './Indicators';
import { IError, Loading } from './Loading';
import { Neck } from './neck';
import { Ui } from './ui';

const USE_COOKIE = true;

const SHOW_INDICATORS = true;

const CONVERT_VARIATION_TO_CHORD_FORM = false;

export interface AppProps {}

const DefaultIndicatorsOptions = {
  mode: IndicatorsMode.Chord,
};

const App: React.FunctionComponent<AppProps> = ({}) => {
  const { getCookie, setCookie } = useCookie();

  const [appOptions, setAppOptions] = useState<AppOptions>();

  const [errors, setErrors] = useState<IError[]>();

  const mainRef = useRef<HTMLDivElement>();

  // Init
  useEffect(() => {
    const saved = getCookie('options');

    let cookie = cookieFromCookieString(saved);
    if (!saved) {
      cookie = Cookie.Default();
    }

    loadOptionsFromCookie(cookie);
  }, []);

  // Initial load
  const loadOptionsFromCookie = (cookie: Cookie) => {
    var requests: Promise<any>[] = [];

    // Chord
    requests.push(loadChord(cookie.chordId));

    // Scale
    requests.push(loadScale());

    // Instrument / Tuning
    requests.push(loadInstrument(cookie?.instrumentId));

    // TODO: figure out what this returns
    Promise.all(requests).then((values: any[]) => {
      const [chord, scale, instrumentResult] = values;
      
      const instrument: Instrument = isArray(instrumentResult)
        ? instrumentResult[0]
        : instrumentResult;
      instrument.NumFrets = cookie.neck.numFrets;

      // Create app options
      const options = {
        chord,
        scale,
        instrument,
        tuning: instrument.DefaultTuning,
        key: cookie.key,
        mode: cookie.mode,
      } as AppOptions;

      const error = validateAppOptions(options);
      if (!!error) {
        setErrors([error]);
      } else {
        handleSetAppOptions(options);
      }
    });
  };

  const loadChord = (chordId?: string): Promise<Chord> => {
    if (chordId) {
      return new ChordApi().GetById(chordId);
    }

    // TODO: static
    // Default chord - C Major
    return new ChordApi().LocateByValues(
      NoteValue.C,
      NoteSuffix.Natural,
      ChordModifier.Major
    );
  };

  const loadScale = (scaleId?: string): Promise<Scale> => {
    if (scaleId) {
      return new ScaleApi().GetById(scaleId);
    }

    // TODO: static
    // Default scale - C diatonic
    return new ScaleApi().LocateByValues(
      NoteValue.C,
      NoteSuffix.Natural,
      ScaleType.Pentatonic,
    );
  };

  // TODO: Combine with loadChord by keeping track of chordIds?
  const reloadChord = (options: AppOptions) => {
    new ChordApi()
      .Locate(options.chord)
      .then((chord) => {
        options.chord = chord;
        finishSetAppOptions(options);
      });
  };

  const reloadScale = (options: AppOptions) => {
    new ScaleApi()
    .Locate(options.scale)
    .then((scale) => {
      options.scale = scale;
      finishSetAppOptions(options);
    })
  }

  const loadInstrument = (instrumentId?: string): Promise<Instrument | Instrument[]> => {
    if (instrumentId) {
      return new InstrumentApi().GetById(instrumentId);
    }

    // TODO: there has to be a better way to provide a default
    return new InstrumentApi().GetAll();
  }


  const validateAppOptions = (appOptions: AppOptions): IError => {
    //
    const required = ['chord', 'instrument', 'tuning', 'key', 'mode'];
    const missing = filter(required, (r) => !appOptions[r]);

    if (missing.length > 0) {
      return {
        message: `Missing options: ${missing.join(', ')}`,
      };
    }

    return null;
  };

  const handleSetAppOptions = (updated: Partial<AppOptions>) => {
    const newOptions = {
      ...appOptions,
      ...updated,
    };

    if (
      appOptions?.chord &&
      updated?.chord &&
      (!NoteUtils.NotesAreEqual(
        updated?.chord?.Root,
        appOptions?.chord?.Root
      ) ||
        updated.chord.Modifier != appOptions?.chord?.Modifier)
    ) {
      reloadChord(newOptions);
    } else if (appOptions?.scale && updated?.scale) {
      reloadScale(newOptions);
    } else {
      finishSetAppOptions(newOptions);
    }
  };

  const finishSetAppOptions = (newOptions: AppOptions) => {
    const error = validateAppOptions(newOptions);
    if (error) {
      debugger;
    }

    setAppOptions(newOptions);
    setCookie('options', cookieStringFromAppOptions(newOptions));
  };


  // TODO: Move to useNeckOptions
  const cookieStringFromAppOptions = (appOptions: AppOptions): string => {
    const cookie = new Cookie();

    cookie.chordId = appOptions.chord.Id;
    cookie.instrumentId = appOptions.instrument.Id;
    cookie.key = appOptions.key;
    cookie.mode = appOptions.mode;
    cookie.neck = {
      numFrets: appOptions.instrument.NumFrets,
    };

    return JSON.stringify(cookie);
  };

  // TODO: Move to useNeckOptions
  const cookieFromCookieString = (cookieString: string): Cookie => {
    if (!cookieString) return null;

    const cookie: Cookie = JSON.parse(cookieString);

    const tonic = new Note(cookie.key.Tonic.Base, cookie.key.Tonic.Suffix);
    cookie.key = new Key(tonic, cookie.key.Type);
    cookie.mode = new Mode(cookie.mode.Label, cookie.mode.pattern);

    return cookie;
  };

  if (appOptions) {
    return (
      <>
        <main ref={mainRef}>
          <Backdrop options={appOptions} />
          <div className="neck-container">
            <Neck options={appOptions} />
          </div>
          {SHOW_INDICATORS && (
            <div className="indicators-container">
              <Indicators appOptions={appOptions} mainRef={mainRef} />
            </div>
          )}
        </main>
        <Ui appOptions={appOptions} setAppOptions={handleSetAppOptions} />
      </>
    );
  }

  return <Loading errors={errors} />;
};

export default App;
