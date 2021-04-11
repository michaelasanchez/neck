import { BaseResponse } from '.';
import { NoteSuffix, NoteValue } from '../enums';
import { Key, KeyType, TuningNote } from '../models';
import { ApiRequest } from './ApiRequest';

export class KeyApi extends ApiRequest<Key> {
  constructor() {
    super('key');
  }

  Locate = (
    type: KeyType,
    base: NoteValue,
    suffix: NoteSuffix
  ): Promise<Key> => {
    this.Action = 'locate';
    return super.Post({ type, base, suffix }) as Promise<Key>;
  };

  LocateAsync = (
    type: KeyType,
    base: NoteValue,
    suffix: NoteSuffix
  ): Promise<BaseResponse<Key>> => {
    this.Action = 'locate';
    return super.PostAsync({ type, base, suffix }) as Promise<
      BaseResponse<Key>
    >;
  };

  SearchAsync = (notes: TuningNote[]): Promise<BaseResponse<Key[]>> => {
    this.Action = 'search';
    return super.PostAsync({ notes }) as Promise<BaseResponse<Key[]>>;
  };
}
