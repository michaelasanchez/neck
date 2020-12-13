import { IndicatorsMode } from "../components";
import { FretDisplayMode } from "../components/neck";
import { ChordVariation } from "../models";

export interface UiOptions {
  fretMode: FretDisplayMode;
  mode: IndicatorsMode;
  variations?: ChordVariation[];
  chord?: ChordVariation;
}