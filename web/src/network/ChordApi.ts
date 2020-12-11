import { Chord, ChordModifier, NoteSuffix, NoteValue } from "../models";
import { ApiRequest } from "./ApiRequest";

export class ChordApi extends ApiRequest<Chord> {
  constructor() {
    super('Chord');
  }

  Quick = (value: NoteValue, suffix: NoteSuffix, modifier: ChordModifier): Promise<Chord> => {
    this.Action = 'quick';
    return super.Post({ value, suffix, modifier }) as Promise<Chord>;
  }
}