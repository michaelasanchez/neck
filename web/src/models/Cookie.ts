import { FretDisplayMode } from '../components/neck';
import { IndicatorsMode } from '../components/ui/indicators';
import { DefaultDockState, DockState } from '../components/ui/tool';

export class Cookie {
  keyId: string;

  instrumentId: string;
  tuningId: string;

  chordId: string;
  scaleId: string;

  neck: NeckOptions;

  dockState: DockState;
  fretDisplayMode: FretDisplayMode;
  indicatorsDisplayMode: FretDisplayMode;
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

      dockState: DefaultDockState,
      fretDisplayMode: FretDisplayMode.Marker,
      indicatorsDisplayMode: FretDisplayMode.Note,
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
