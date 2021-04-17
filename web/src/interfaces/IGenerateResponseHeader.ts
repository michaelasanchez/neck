import { Key, Tuning } from '../models';

export interface IGenerateResponseHeader<TVariation> {
  BaseId: string;
  // InstrumentId: string;
  TuningId: string;
  Tuning: Tuning;
  Offset: number;
  Range?: number;
  Span: number;
  Keys: Key[];
  Variations: TVariation[];
}
