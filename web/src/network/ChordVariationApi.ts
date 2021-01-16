import { Chord, ChordVariation, Tuning } from "../models";
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
  Generate = 'generate',
  GenerateRange = 'generaterange',
}

export class ChordVariationApi extends ApiRequest<ChordVariation> {

  constructor() {
    super('chordvariation');
  }

  Generate(params: ChordVariationGenerateParams): Promise<ChordVariation[]> {
    return super.Post(params, ChordVariationAction.Generate) as Promise<ChordVariation[]>;
  }

  GenerateRange(params: ChordVariationGenerateRangeParams): Promise<ChordVariation[]> {
    return super.Post(params, ChordVariationAction.GenerateRange) as Promise<ChordVariation[]>;
  }

}