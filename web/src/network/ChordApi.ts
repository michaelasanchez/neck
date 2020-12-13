import { Chord, ChordModifier, Note, NoteSuffix, NoteValue } from "../models";
import { ApiRequest } from "./ApiRequest";

export class ChordApi extends ApiRequest<Chord> {
  constructor() {
    super('Chord');
  }

  QuickFromValues = (value: NoteValue, suffix: NoteSuffix, modifier: ChordModifier): Promise<Chord> => {
    this.Action = 'quick';
    return super.Post({ value, suffix, modifier }) as Promise<Chord>;
  }

  Quick = (note: Note, modifier: ChordModifier): Promise<Chord> => {
    this.Action = 'quick';
    return super.Post({ value: note.Base, suffix: note.Suffix, modifier }) as Promise<Chord>;
  }
}