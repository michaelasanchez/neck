import { FretDisplayMode } from '../components/neck';
import { IndicatorsMode } from '../components/ui/indicators';

export class Cookie {
  keyId: string;

  instrumentId: string;
  tuningId: string;

  chordId: string;
  scaleId: string;

  neck: NeckOptions;

  fretDisplayMode: FretDisplayMode;
  indicatorsMode: IndicatorsMode;

  leftHandMode: boolean;
  leftHandUi: boolean;
  autoScroll: boolean;

  static Default(): Cookie {
    return {
      keyId: null,

      chordId: null,
      instrumentId: null,
      tuningId: null,

      fretDisplayMode: FretDisplayMode.Note,
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
