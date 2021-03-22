import { Key, Mode } from '.';
import { IndicatorsMode } from '../components';

export class Cookie {
  instrumentId: string;
  
  chordId: string;
  scaleId: string;

  key: Key;
  mode: Mode;

  neck: NeckOptions;

  indicatorsMode: IndicatorsMode;

  static Default(): Cookie {
    return {
      chordId: null,
      instrumentId: null,

      key: Key.C(),

      mode: Mode.Ionian(),
      indicatorsMode: IndicatorsMode.Chord,

      neck: {
        numFrets: "14",
      },
    } as Cookie;
  }
}

export class NeckOptions {
  // stored as string, need to parse
  numFrets: string;
}
