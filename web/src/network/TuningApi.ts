import { Tuning } from "../models";
import { ApiRequest } from "./ApiRequest";

export class TuningApi extends ApiRequest<Tuning> {
  constructor() {
    super('Tuning');
  }
}