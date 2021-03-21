import { BaseResponse } from '.';
import { IGenerateResponseHeader } from '../interfaces';
import { Chord, ChordVariation, Tuning } from '../models';
import { ApiRequest } from './ApiRequest';

export interface ChordVariationGenerateParams {
  baseId?: string;
  base?: Partial<Chord>;
  tuningId?: string;
  tuning?: Partial<Tuning>;
  offset?: number;
  span?: number;
}

export interface ChordVariationGenerateRangeParams
  extends ChordVariationGenerateParams {
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
  Generate(
    params: ChordVariationGenerateParams
  ): Promise<BaseResponse<IGenerateResponseHeader<ChordVariation>>> {
    return super.PostAsync(params, ChordVariationAction.Generate) as Promise<
      BaseResponse<IGenerateResponseHeader<ChordVariation>>
    >;
  }

  GenerateRange = (
    params: ChordVariationGenerateRangeParams
  ): Promise<BaseResponse<IGenerateResponseHeader<ChordVariation>>> => {
    return super.PostAsync(
      params,
      ChordVariationAction.GenerateRange
    ) as Promise<BaseResponse<IGenerateResponseHeader<ChordVariation>>>;
  };
}
