import { NoteSuffix, NoteValue, ScaleType } from '../enums';
import { Scale } from '../models';
import { ApiRequest } from './ApiRequest';

export class ScaleApi extends ApiRequest<Scale> {
  constructor() {
    super('scale');
  }

  LocateByValues = (
    value: NoteValue,
    suffix: NoteSuffix,
    type: ScaleType
  ): Promise<Scale> => {
    this.Action = 'byvalues';
    return super.Post({ value, suffix, type }) as Promise<Scale>;
  };

  Locate = (scale: Scale): Promise<Scale> => {
    this.Action = 'byvalues';
    return super.Post({
      value: scale.Tonic.Base,
      suffix: scale.Tonic.Suffix,
      type: scale.Type,
    }) as Promise<Scale>;
  };
}
