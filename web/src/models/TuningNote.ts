import { Note, NoteSuffix, NoteValue } from '.';

export class TuningNote extends Note {
  public Octave: number;

  constructor(
    value: NoteValue = NoteValue.C,
    suffix: NoteSuffix = NoteSuffix.Natural,
    octave: number
  ) {
    super(value, suffix);

    this.Octave = octave;
  }

  public Equals(note: TuningNote) {
    return !!note && this.Octave == note.Octave && super.Equals(note as Note);
  }
}
