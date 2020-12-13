import { ApiEntity } from "../network";
import { Formation } from "./Formation";
import { Tuning } from "./Tuning";

// TODO: static
const STATIC_NUM_FRETS = 20;

export enum InstrumentEnum {
  Guitar,
  Ukulele
}

export class Instrument extends ApiEntity {
  public DefaultTuning: Tuning;
  public DefaultTuningId: string;
  public Label: string;
  public NumFrets: number;
  public NumStrings: number = STATIC_NUM_FRETS;
  public Formation: Formation;
}