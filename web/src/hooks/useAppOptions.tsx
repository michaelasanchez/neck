import { every, filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useNeckCookie } from '.';
import { IError } from '../components/Loading';
import { NoteSuffix, NoteValue, ScaleType } from '../enums';
import {
  Chord,
  ChordModifier,
  Cookie,
  Instrument,
  Key,
  KeyType,
  Scale,
  Tuning,
} from '../models';
import {
  ChordApi,
  InstrumentApi,
  KeyApi,
  ScaleApi,
  TuningApi,
} from '../network';
import { AppOptions } from '../shared';

const validateAppOptions = (appOptions: AppOptions): IError => {
  //
  const required = ['chord', 'instrument', 'key', 'scale'];
  const missing = filter(required, (r) => !appOptions[r]);

  if (missing.length > 0) {
    return {
      message: `Missing options: ${missing.join(', ')}`,
    };
  }

  return null;
};

const loadKey = (keyId?: string): Promise<Key> => {
  if (!!keyId) {
    return new KeyApi().GetById(keyId);
  }

  // TODO: static
  return new KeyApi().Locate(KeyType.Major, NoteValue.C, NoteSuffix.Natural);
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

// TODO: This operates pretty loosely right now and assumes that
//  instrument is going to have a default tuning
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

    // Key
    requests.push(loadKey(cookie.keyId));

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
      if (every(values, (v) => !v)) {
        setErrors([{ message: 'Whoops! Something went wrong...' }]);
      } else {
        const [key, chord, scale, instrument, tuning] = values;
        instrument.NumFrets = parseInt(cookie.neck.numFrets);

        // Create app options
        const options = {
          key,

          instrument,
          tuning: tuning || instrument.DefaultTuning,

          chord,
          scale,

          dockState: cookie.dockState,
          fretDisplayMode: cookie.fretDisplayMode,
          indicatorsDisplayMode: cookie.indicatorsDisplayMode,
          indicatorsMode: cookie.indicatorsMode,

          leftHandMode: cookie.leftHandMode,
          leftHandUi: cookie.leftHandUi,
          autoScroll: cookie.autoScroll,
        } as AppOptions;

        setAppOptions(options);
        setLoading(false);
      }
    });
  };

  const reloadKey = (options: AppOptions) => {
    new KeyApi()
      .Locate(
        options.key.Type,
        options.key.Tonic.Base,
        options.key.Tonic.Suffix
      )
      .then((key) => {
        options.key = key;
        finishSetAppOptions(options);
      });
  };

  const reloadChord = (options: AppOptions) => {
    new ChordApi().Locate(options.chord).then((chord) => {
      options.chord = chord;
      finishSetAppOptions(options);
    });
  };

  const reloadScale = (options: AppOptions) => {
    new ScaleApi().Locate(options.scale).then((scale) => {
      options.scale = scale;
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
    } else if (appOptions?.key && updated?.key && !updated.key.Scale) {
      // TODO: Navbar uses Keys.DropdownValues which is missing
      reloadKey(newOptions);
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
      // addNotification(validationError.message);
      setErrors([validationError]);
    } else {
      setAppOptions(newOptions);
      setCookie(newOptions);
    }
  };

  return { appOptions, setAppOptions: handleSetAppOptions, errors, loading };
};
