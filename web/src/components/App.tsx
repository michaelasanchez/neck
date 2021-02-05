import { filter, isArray } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Backdrop, Indicators } from '.';
import { useAppOptionsContext } from '..';
import { useNeckCookie } from '../hooks';
import {
  Chord,
  ChordModifier,
  Cookie,
  Instrument,
  Key,
  KeyType,
  Note,
  NoteSuffix,
  NoteValue,
  Scale,
  ScaleType,
} from '../models';
import { ChordApi, InstrumentApi, ScaleApi } from '../network';
import { AppOptions } from '../shared';
import { IError, Loading } from './Loading';
import { Neck } from './neck';
import { Ui } from './ui';

const SHOW_INDICATORS = true;

export interface AppProps {}

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
    ScaleType.Diatonic
  );
};

const loadInstrument = (
  instrumentId?: string
): Promise<Instrument | Instrument[]> => {
  if (instrumentId) {
    return new InstrumentApi().GetById(instrumentId);
  }

  // TODO: there has to be a better way to provide a default
  return new InstrumentApi().GetAll();
};

const App: React.FunctionComponent<AppProps> = ({}) => {
  const { loading: cookieLoading, cookie, setCookie } = useNeckCookie();
  const { appOptions, setAppOptions } = useAppOptionsContext();

  const [errors, setErrors] = useState<IError[]>();

  const mainRef = useRef<HTMLDivElement>();

  // Init
  useEffect(() => {
    if (!cookieLoading) {
      loadOptionsFromCookie(cookie);
    }
  }, [cookieLoading]);

  // Initial load
  const loadOptionsFromCookie = (cookie: Cookie) => {
    var requests: Promise<any>[] = [];

    // Chord
    requests.push(loadChord(cookie.chordId));

    // Scale
    requests.push(loadScale(cookie.scaleId));

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
        indicatorsMode: cookie.indicatorsMode,
      } as AppOptions;

      const error = validateAppOptions(options);
      if (!!error) {
        setErrors([error]);
      } else {
        handleSetAppOptions(options);
      }
    });
  };

  // TODO: Combine with loadChord by keeping track of chordIds?
  const reloadChord = (options: AppOptions) => {
    new ChordApi().Locate(options.chord).then((chord) => {
      options.chord = chord;
      finishSetAppOptions(options);
    });
  };

  const reloadScale = (options: AppOptions) => {
    new ScaleApi().Locate(options.scale).then((scale) => {
      options.scale = scale;
      // TODO: Neck still depends on scales generated from Note
      options.key = new Key(
        new Note(scale.Tonic.Base, scale.Tonic.Suffix),
        scale.Type == ScaleType.NaturalMinor ? KeyType.Minor : KeyType.Major
      );
      finishSetAppOptions(options);
    });
  };

  const handleSetAppOptions = (updated: Partial<AppOptions>) => {
    const newOptions = {
      ...appOptions,
      ...updated,
    };

    if (appOptions?.chord && updated?.chord) {
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
    setCookie(newOptions);
  };

  if (appOptions) {
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
