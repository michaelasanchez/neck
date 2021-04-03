import { FretDisplayMode } from '../components/neck';
import { IndicatorsMode } from '../components/ui/indicators';
import { ChordVariation } from '../models';

export interface UiOptions {
  fretMode: FretDisplayMode;
  mode: IndicatorsMode;
  variations?: ChordVariation[];
  chord?: ChordVariation;
}
