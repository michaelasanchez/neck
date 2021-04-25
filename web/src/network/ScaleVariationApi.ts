import { BaseResponse } from '.';
import { IGenerateResponseHeader } from '../interfaces';
import { Scale, ScaleVariation, Tuning } from '../models';
import { ApiRequest } from './ApiRequest';

export interface ScaleVariationGenerateParams {
  baseId?: string;
  tuningId?: string;
  offset?: number;
  span?: number;
  range?: number;
}

enum ScaleVariationAction {
  Generate = 'generate',
}

export class ScaleVariationApi extends ApiRequest<ScaleVariation> {
  constructor() {
    super('scalevariation');
  }

  Generate = (
    params: ScaleVariationGenerateParams
  ): Promise<BaseResponse<IGenerateResponseHeader<ScaleVariation>>> => {
    return super.PostAsync(
      params,
      ScaleVariationAction.Generate
    ) as Promise<BaseResponse<IGenerateResponseHeader<ScaleVariation>>>;
  };
}
