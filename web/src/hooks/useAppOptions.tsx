import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useNeckCookie } from '.';
import { IError } from '../components/Loading';
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
  Tuning,
} from '../models';
import { ChordApi, InstrumentApi, ScaleApi, TuningApi } from '../network';
import { AppOptions } from '../shared';

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
  return new InstrumentApi().GetAll().then((i: Array<Instrument>) => i[0]);
};

const loadTuning = (tuningId?: string): Promise<Tuning> => {
  if (tuningId) {
    return new TuningApi().GetById(tuningId);
  }
  return Promise.resolve(null);
};

export const useAppOptions = () => {
  const { loading: cookieLoading, cookie, setCookie } = useNeckCookie();

  const [appOptions, setAppOptions] = useState<AppOptions>();

  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<IError[]>();

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

    // Instrument
    requests.push(loadInstrument(cookie?.instrumentId));

    // Tuning
    requests.push(loadTuning(cookie?.tuningId));

    // TODO: figure out what this returns
    Promise.all(requests).then((values: any[]) => {
      const [chord, scale, instrument, tuning] = values;
      instrument.NumFrets = parseInt(cookie.neck.numFrets);

      // Create app options
      const options = {
        chord,
        scale,
        instrument,
        tuning: tuning || instrument.DefaultTuning,

        key: cookie.key,
        mode: cookie.mode,
        indicatorsMode: cookie.indicatorsMode,
      } as AppOptions;

      setAppOptions(options);
      setLoading(false);
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
    const validationError = validateAppOptions(newOptions);
    if (validationError) {
      debugger;
    }

    if (!!validationError) {
      setErrors([validationError]);
    } else {
      setAppOptions(newOptions);
      setCookie(newOptions);
    }
  };
  return { appOptions, setAppOptions: handleSetAppOptions, errors, loading };
};
