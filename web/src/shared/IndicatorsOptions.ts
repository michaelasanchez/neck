import { IndicatorsMode } from "../components/ui/indicators";
import { ChordVariation, ScaleVariation, TuningNote } from "../models";

export interface IndicatorsOptions {

  // indicatorsMode?: IndicatorsMode;

  chordVariation?: ChordVariation;
  scaleVariation?: ScaleVariation;

  searchArray?: TuningNote[];
}