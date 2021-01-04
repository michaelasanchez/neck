import { Scale, ScaleVariation, Tuning } from "../models";
import { ApiRequest } from "./ApiRequest";

export interface ScaleVariationGenerateParams {
  chordId?: string;
  chord?: Partial<Scale>;
  tuningId?: string;
  tuning?: Partial<Tuning>;
  offset?: number;
  span?: number;
}

export interface ScaleVariationGenerateRangeParams extends ScaleVariationGenerateParams {
  range?: number;
}

enum ScaleVariationAction {
  Generate = 'Generate',
  // GenerateRange = 'GenerateRange',
}

export class ScaleVariationApi extends ApiRequest<ScaleVariation> {

  constructor() {
    super('ScaleVariation');
  }

  Generate(): Promise<ScaleVariation[]> {
    return super.Post(null, ScaleVariationAction.Generate) as Promise<ScaleVariation[]>;
  }

  // GenerateRange(params: ScaleVariationGenerateRangeParams): Promise<ScaleVariation[]> {

  //   // TODO: Figure out what is goin on here. Cheap fix for now
  //   if (params.chord) params.chord = this.hack(params.chord);

  //   return super.Post(params, ScaleVariationAction.GenerateRange) as Promise<ScaleVariation[]>;
  // }

}