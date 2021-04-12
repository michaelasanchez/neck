import { IndicatorsMode } from '../components/ui/indicators';
import { ChordVariation, Instrument, Key, Scale, Tuning } from '../models';
import { Chord } from '../models/api';

export interface AppOptions {
  key: Key;

  chord: Chord;
  scale: Scale;

  instrument: Instrument;
  tuning: Tuning;

  leftHandMode: boolean;
  leftHandUi: boolean;
  autoScroll: boolean;

  // Ui?
  indicatorsMode?: IndicatorsMode;

  // Validation
  [key: string]: any;
}

//  C           D           E     F           G           A           B
//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
//  B#                      Fb    E#                                  Cb
//  0     1     2     3     4     5     6     7     8     9     10    11
