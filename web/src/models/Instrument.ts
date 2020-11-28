import { ApiType } from ".";
import { Tuning } from "./Tuning";

export enum InstrumentEnum {
  Guitar,
  Ukulele
}

export class Instrument extends ApiType {
  public DefaultTuning: Tuning;
  public DefaultTuningId: string;
  public Label: string;
  public NumStrings: number;
}