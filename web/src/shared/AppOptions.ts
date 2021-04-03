import { IndicatorsMode } from '../components/ui/indicators';
import {
  Chord,
  ChordVariation,
  Instrument,
  Key,
  Mode,
  Scale,
  ScaleVariation,
  Tuning,
} from '../models';

export interface AppOptions {
  chord: Chord;
  scale: Scale;

  instrument: Instrument;
  tuning: Tuning;

  key: Key;
  mode: Mode; // Options modal

  leftHandMode: boolean;
  leftHandUi: boolean;
  autoScroll: boolean;

  // Ui?
  indicatorsMode?: IndicatorsMode;

  chordVariation?: ChordVariation; // Indicators
  scaleVariation?: ScaleVariation;

  // Validation
  [key: string]: any;
}

// TODO: get rid of this
export interface IOption {
  Label: string;
}

//  C           D           E     F           G           A           B
//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
//  B#                      Fb    E#                                  Cb
//  0     1     2     3     4     5     6     7     8     9     10    11
