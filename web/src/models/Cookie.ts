import { Key, Mode } from '.';
import { IndicatorsMode } from '../components/ui/indicators';

export class Cookie {
  instrumentId: string;
  tuningId: string;

  chordId: string;
  scaleId: string;

  key: Key;
  mode: Mode;

  neck: NeckOptions;

  indicatorsMode: IndicatorsMode;

  leftHandMode: boolean;
  leftHandUi: boolean;
  autoScroll: boolean;

  static Default(): Cookie {
    return {
      chordId: null,
      instrumentId: null,
      tuningId: null,

      key: Key.C(),
      mode: Mode.Ionian(),

      indicatorsMode: null,

      leftHandMode: false,
      leftHandUi: false,
      autoScroll: true,

      neck: {
        numFrets: '14',
      },
    } as Cookie;
  }
}

export class NeckOptions {
  // stored as string, need to parse
  numFrets: string;
}
