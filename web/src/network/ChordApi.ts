import { Chord, ChordModifier, Note, NoteSuffix, NoteValue } from "../models";
import { ApiRequest } from "./ApiRequest";

export class ChordApi extends ApiRequest<Chord> {
  constructor() {
    super('chord');
  }

  LocateByValues = (value: NoteValue, suffix: NoteSuffix, modifier: ChordModifier): Promise<Chord> => {
    this.Action = 'byvalues';
    return super.Post({ value, suffix, modifier }) as Promise<Chord>;
  }

  Locate = (chord: Chord): Promise<Chord> => {
    this.Action = 'byvalues';
    return super.Post({ value: chord.Root.Base, suffix: chord.Root.Suffix, modifier: chord.Modifier }) as Promise<Chord>;
  }
}