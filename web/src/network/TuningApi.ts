import { BaseResponse } from ".";
import { Tuning } from "../models";
import { ApiRequest } from "./ApiRequest";

export class TuningApi extends ApiRequest<Tuning> {
  constructor() {
    super('tuning');
  }

  ByInstrument = (instrumentId: string): Promise<BaseResponse<Tuning[]>> => {
    this.Action = `byinstrument/${instrumentId}`;
    return super.GetAsync() as Promise<BaseResponse<Tuning[]>>;
  }
}