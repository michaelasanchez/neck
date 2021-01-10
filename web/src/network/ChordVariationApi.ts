import { Chord, ChordModifier, ChordVariation, Note, Tuning } from "../models";
import { ApiRequest } from "./ApiRequest";

export interface ChordVariationGenerateParams {
  chordId?: string;
  chord?: Partial<Chord>;
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

export const modifyVariationParams = (params: ChordVariationGenerateParams | ChordVariationGenerateRangeParams) => {
  var modified = {
    ...params,
    base: params.chord,
    baseId: params.chordId,
  }
  delete modified.chord;
  delete modified.chordId;
  return modified;
}

export class ChordVariationApi extends ApiRequest<ChordVariation> {

  constructor() {
    super('ChordVariation');
  }

  Generate(params: ChordVariationGenerateParams): Promise<ChordVariation[]> {
    return super.Post(modifyVariationParams(params), ChordVariationAction.Generate) as Promise<ChordVariation[]>;
  }

  GenerateRange(params: ChordVariationGenerateRangeParams): Promise<ChordVariation[]> {
    return super.Post(modifyVariationParams(params), ChordVariationAction.GenerateRange) as Promise<ChordVariation[]>;
  }

}