import { Chord } from "../models";
import { ApiRequest } from "./ApiRequest";

export class ChordApi extends ApiRequest<Chord> {
  constructor() {
    super('Chord');
  }
}