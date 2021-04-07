import { BaseResponse } from ".";
import { Key, KeyType, NoteSuffix, NoteValue, TuningNote } from "../models";
import { ApiRequest } from "./ApiRequest";

export class KeyApi extends ApiRequest<Key> {
  constructor() {
    super('key');
  }

  Locate = (type: KeyType, base: NoteValue, suffix: NoteSuffix): Promise<Key> => {
    this.Action = 'locate';
    return super.Post({ type, base, suffix }) as Promise<Key>;
  }

  Search = (notes: TuningNote[]): Promise<BaseResponse<Key[]>> => {
    this.Action = 'search';
    return super.PostAsync({ notes }) as Promise<BaseResponse<Key[]>>;
  }
}