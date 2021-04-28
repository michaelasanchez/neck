import { BaseResponse } from '.';
import { IGenerateResponseHeader } from '../interfaces';
import { ChordVariation } from '../models';
import { ApiRequest } from './ApiRequest';

export interface ChordVariationGenerateParams {
  baseId?: string;
  tuningId?: string;
  offset?: number;
  span?: number;
  range?: number;

  enforceTones?: boolean;
  filterInversions?: boolean;
  insertFirstMuted?: boolean;
  insertOpen?: boolean;
  insertMuted?: boolean;
}

enum ChordVariationAction {
  Generate = 'generate',
}

export class ChordVariationApi extends ApiRequest<ChordVariation> {
  constructor() {
    super('chordvariation');
  }

  Generate = (
    params: ChordVariationGenerateParams
  ): Promise<BaseResponse<IGenerateResponseHeader<ChordVariation>>> => {
    return super.PostAsync(params, ChordVariationAction.Generate) as Promise<
      BaseResponse<IGenerateResponseHeader<ChordVariation>>
    >;
  };
}
