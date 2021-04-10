import { NoteSuffix, NoteValue, TuningNote } from '.';

export class FretNote extends TuningNote {
  public String: number;
  public Fret: number;
  constructor(
    value: NoteValue,
    suffix: NoteSuffix,
    octave: number,
    string: number,
    fret: number
  ) {
    super(value, suffix, octave);
    this.String = string;
    this.Fret = fret;
  }
}
