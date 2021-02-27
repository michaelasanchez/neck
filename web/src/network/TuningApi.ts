import { Tuning } from "../models";
import { ApiRequest } from "./ApiRequest";

export class TuningApi extends ApiRequest<Tuning> {
  constructor() {
    super('tuning');
  }

  ByInstrument = (instrumentId: string): Promise<Array<Tuning>> => {
    this.Action = `byinstrument/${instrumentId}`;
    return super.Get() as Promise<Array<Tuning>>;
  }
}