import { ChordVariation, FretNote, ScaleVariation } from '../models';

export interface IndicatorsOptions {
  chordVariation?: ChordVariation;
  scaleVariation?: ScaleVariation;

  searchArray?: FretNote[];
}
