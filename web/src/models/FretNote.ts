import { TuningNote } from '.';
import { NoteSuffix, NoteValue } from '../enums';

export class FretNote {
  public Note: TuningNote;
  public String: number;
  public Fret: number;

  constructor(
    value: NoteValue,
    suffix: NoteSuffix,
    octave: number,
    string: number,
    fret: number
  ) {
    this.Note = new TuningNote(value, suffix, octave);
    this.String = string;
    this.Fret = fret;
  }
}
