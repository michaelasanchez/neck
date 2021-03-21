import { BaseResponse } from '.';
import { IGenerateResponseHeader } from '../interfaces';
import { Scale, ScaleVariation, Tuning } from '../models';
import { ApiRequest } from './ApiRequest';

export interface ScaleVariationGenerateParams {
  baseId?: string;
  base?: Partial<Scale>;
  tuningId?: string;
  tuning?: Partial<Tuning>;
  offset?: number;
  span?: number;
}

export interface ScaleVariationGenerateRangeParams
  extends ScaleVariationGenerateParams {
  range?: number;
}

enum ScaleVariationAction {
  Generate = 'generate',
  GenerateRange = 'generaterange',
}

export class ScaleVariationApi extends ApiRequest<ScaleVariation> {
  constructor() {
    super('scalevariation');
  }

  Generate = (
    params: ScaleVariationGenerateParams
  ): Promise<BaseResponse<IGenerateResponseHeader<ScaleVariation>>> => {
    return super.PostAsync(params, ScaleVariationAction.Generate) as Promise<
      BaseResponse<IGenerateResponseHeader<ScaleVariation>>
    >;
  };

  GenerateRange = (
    params: ScaleVariationGenerateRangeParams
  ): Promise<BaseResponse<IGenerateResponseHeader<ScaleVariation>>> => {
    return super.PostAsync(
      params,
      ScaleVariationAction.GenerateRange
    ) as Promise<BaseResponse<IGenerateResponseHeader<ScaleVariation>>>;
  };
}
