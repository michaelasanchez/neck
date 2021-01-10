import { Chord, ChordModifier, ChordVariation, Note, Tuning } from "../models";
import { ApiRequest } from "./ApiRequest";

export interface ChordVariationGenerateParams {
  baseId?: string;
  base?: Partial<Chord>;
  tuningId?: string;
  tuning?: Partial<Tuning>;
  offset?: number;
  span?: number;
}

export interface ChordVariationGenerateRangeParams extends ChordVariationGenerateParams {
  range?: number;
}

enum ChordVariationAction {
  Generate = 'Generate',
  GenerateRange = 'GenerateRange',
}

export class ChordVariationApi extends ApiRequest<ChordVariation> {

  constructor() {
    super('ChordVariation');
  }

  Generate(params: ChordVariationGenerateParams): Promise<ChordVariation[]> {
    return super.Post(params, ChordVariationAction.Generate) as Promise<ChordVariation[]>;
  }

  GenerateRange(params: ChordVariationGenerateRangeParams): Promise<ChordVariation[]> {
    return super.Post(params, ChordVariationAction.GenerateRange) as Promise<ChordVariation[]>;
  }

}