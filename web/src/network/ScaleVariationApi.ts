import { Scale, ScaleVariation, Tuning } from "../models";
import { ApiRequest } from "./ApiRequest";

export interface ScaleVariationGenerateParams {
  baseId?: string;
  base?: Partial<Scale>;
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
  GenerateRange = 'GenerateRange',
}

export class ScaleVariationApi extends ApiRequest<ScaleVariation> {

  constructor() {
    super('ScaleVariation');
  }

  Generate(params: ScaleVariationGenerateParams): Promise<ScaleVariation[]> {
    return super.Post(params, ScaleVariationAction.Generate) as Promise<ScaleVariation[]>;
  }

  GenerateRange(params: ScaleVariationGenerateRangeParams): Promise<ScaleVariation[]> {
    return super.Post(params, ScaleVariationAction.GenerateRange) as Promise<ScaleVariation[]>;
  }

}