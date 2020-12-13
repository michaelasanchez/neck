import { filter, isArray, map } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Backdrop, Indicators } from '.';
import { useCookie } from '../hooks/useCookie';
import { IApiEntity } from '../interfaces/IApiEntity';
import {
  Chord,
  ChordModifier,
  ChordVariation,
  Instrument,
  Key,
  Mode,
  Note,
  NoteSuffix,
  NoteValue,
  Tuning,
} from '../models';
import Cookie from '../models/Cookie';
import {
  ApiRequest,
  ChordVariationApi,
  ChordVariationGenerateRangeParams,
} from '../network';
import { ChordApi } from '../network/ChordApi';
import { InstrumentApi } from '../network/InstrumentApi';
import { AppOptions, NoteUtils } from '../shared';
import { IndicatorsMode } from './Indicators';
import { IError, Loading } from './Loading';
import { Neck } from './neck';
import { Ui } from './ui';

const USE_COOKIE = true;

const SHOW_INDICATORS = true;

const CONVERT_VARIATION_TO_CHORD_FORM = false;

export interface AppProps {}

const parseOptionsCookie = (cookieString: string): AppOptions => {
  let parsed = JSON.parse(cookieString);

  const rootNote = new Note(parsed.key._tonic.base, parsed.key._tonic.suffix);
  const chordRoot = new Note(parsed.chord.Root.Base, parsed.chord.Root.Suffix);

  parsed.chord = new Chord(chordRoot, parsed.chord.Modifier);
  parsed.key = new Key(rootNote);
  parsed.mode = new Mode(parsed.mode.name, parsed.mode.pattern);
  parsed.tuning = new Tuning(parsed.tuning.Label, parsed.tuning.Offsets);

  return parsed;
};

const serializeOptionsCookie = (options: AppOptions): string => {
  const newOptions = { ...options };

  newOptions.chord = {
    Root: {
      Base: options.chord.Root.Base,
      Suffix: options.chord.Root.Suffix,
    },
    Modifier: options.chord.Modifier,
  } as Chord;
  // TODO: Fix this
  // options.key = {
  //   Tonic: {
  //     Base: options.key.Tonic.Base,
  //     Suffix: options.key.Tonic.Suffix,
  //   }
  // } as Key;
  newOptions.tuning = {
    Label: options.tuning.Label,
    Offsets: newOptions.tuning.Offsets,
  } as Tuning;
  return JSON.stringify(newOptions);
};

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

    let cookie: Cookie;
    if (!saved) {
      cookie = Cookie.Default();
    }

    loadOptionsFromCookie(cookie);
    // const options =
    //   USE_COOKIE && !!saved.length
    //     ? loadOptions(parseOptionsCookie(saved))
    //     : loadDefault();
  }, []);

  // Chord & Variation refresh
  useEffect(() => {}, [appOptions?.chord]);

  // FULL:
  // chord            Default/Re-load from API
  // instrument       Load from API
  // key              Default
  // mode             Default
  // tuning           Load from API (instrument)
  // variations       G?
  const loadOptionsFromCookie = (cookie: Cookie) => {
    var requests: Promise<any>[] = [];

    // Always request chord
    let chordReq: Promise<Chord>;
    if (cookie.chordId) {
      chordReq = new ChordApi().GetById(cookie.chordId);
    } else {
      // TODO: static
      chordReq = new ChordApi().QuickFromValues(
        NoteValue.C,
        NoteSuffix.Natural,
        ChordModifier.Major
      );
    }
    requests.push(chordReq);

    let instrumentReq: Promise<Instrument | Instrument[]>;
    if (cookie.instrumentId) {
      instrumentReq = new InstrumentApi().GetById(cookie.instrumentId);
    } else {
      instrumentReq = new InstrumentApi().GetAll();
    }
    requests.push(instrumentReq);

    // TODO: figure out what this returns
    Promise.all(requests).then((values: any[]) => {
      // instrumentReq.then(instrumentResult => {
      const [chord, instrumentResult] = values;

      const instrument: Instrument = isArray(instrumentResult)
        ? instrumentResult[0]
        : instrumentResult;
      instrument.NumFrets = cookie.neck.numFrets;

      // Create app options
      const options = {
        chord,
        instrument,
        tuning: instrument.DefaultTuning, // TODO: static
        key: cookie.key,
        mode: cookie.mode,
      } as AppOptions;

      const error = validateAppOptions(options);
      if (!!error) {
        setErrors([error]);
      } else {
        handleSetOptions(options);
      }
    });
  };

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

  const cookieFromAppOptions = (appOptions: AppOptions): Cookie => {
    const cookie = new Cookie();

    cookie.chordId = appOptions.chord.Id;
    cookie.instrumentId = appOptions.instrument.Id;

    return cookie;
  };

  const handleSetOptions = (updated: Partial<AppOptions>) => {
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
      new ChordApi()
        .Quick(newOptions.chord.Root, newOptions.chord.Modifier)
        .then((chord) => {
          newOptions.chord = chord;
          reloadChordVariations(newOptions);
        });
    } else if (!appOptions?.variations) {
      reloadChordVariations(newOptions);
    } else {
      finishSetOptions(newOptions);
    }
  };

  const reloadChordVariations = (options: AppOptions) => {
    new ChordVariationApi()
      .GenerateRange({
        chordId: options.chord.Id,
        tuningId: options.tuning.Id,
        range: options.instrument.NumFrets,
      } as ChordVariationGenerateRangeParams)
      .then((variations: any[]) => {
        // TODO: constructor logic should probably move
        const newVariations = map(
          variations,
          (v) =>
            new ChordVariation(
              v.Formation.Positions,
              v.Formation.Barres,
              v.Chord,
              v.Tuning
            )
        );

        options.variations = newVariations;
        finishSetOptions(options);
      });
  };

  const finishSetOptions = (newOptions: AppOptions) => {
    const error = validateAppOptions(newOptions);
    if (error) {
      debugger;
    }

    setAppOptions(newOptions);
    // setCookie('options', serializeOptionsCookie(newOptions));
  };

  if (appOptions) {
    return (
      <>
        <main ref={mainRef}>
          {/* instrument, tuning */}
          <Backdrop options={appOptions} />
          <div className="neck-container">
            {/* key, tuning, mode, instrument */}
            <Neck options={appOptions} />
          </div>
          {SHOW_INDICATORS && (
            <div className="indicators-container">
              {/* chordVariation, tuning, instrument */}
              {/* TODO: right now chordVariation is set in ChordSlideIn as an effect of variations updating */}
              <Indicators appOptions={appOptions} mainRef={mainRef} />
            </div>
          )}
        </main>
        {/* key, mode, tuning */}
        {/* ChordSlideIn - chord, variations */}
        <Ui appOptions={appOptions} setAppOptions={handleSetOptions} />
      </>
    );
  }

  return <Loading errors={errors} />;
};

export default App;
