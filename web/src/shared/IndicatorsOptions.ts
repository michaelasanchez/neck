import { ChordVariation, ScaleVariation, TuningNote } from '../models';

export interface IndicatorsOptions {
  chordVariation?: ChordVariation;
  scaleVariation?: ScaleVariation;

  searchArray?: TuningNote[];
}
