import { Instrument } from "../models";
import { ApiRequest } from "./ApiRequest";

export class InstrumentApi extends ApiRequest<Instrument> {
  constructor() {
    super('Instrument');
  }
}