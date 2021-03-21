export interface IGenerateResponseHeader<TVariation> {
  BaseId: string;
  InstrumentId: string;
  TuningId: string;
  Offset: number;
  Range?: number;
  Span: number;
  Variations: Array<TVariation>;
}
