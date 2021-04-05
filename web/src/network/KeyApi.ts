import { Key, KeyType, NoteSuffix, NoteValue } from "../models";
import { ApiRequest } from "./ApiRequest";

export class KeyApi extends ApiRequest<Key> {
  constructor() {
    super('key');
  }

  Locate = (type: KeyType, base: NoteValue, suffix: NoteSuffix): Promise<Key> => {
    this.Action = 'locate';
    return super.Post({ type, base, suffix }) as Promise<Key>;
  }
}