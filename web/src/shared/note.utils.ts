import { every, map } from 'lodash';
import { NoteValue } from '../enums';
import { Note, TuningNote } from '../models';

export class NoteUtils {
  static NotesAreEqual = (noteA: Note, noteB: Note): boolean => {
    if (!noteA || !noteB) return false;
    return noteA.Base == noteB.Base && noteA.Suffix == noteB.Suffix;
  };

  static TuningNotesAreEqual = (
    noteA: TuningNote,
    noteB: TuningNote
  ): boolean => {
    if (!noteA || !noteB) return false;
    return (
      noteA.Base == noteB.Base &&
      noteA.Suffix == noteB.Suffix &&
      noteA.Octave == noteB.Octave
    );
  };

  static OffsetsAreEqual = (offsetsA: TuningNote[], offsetsB: TuningNote[]) => {
    return every(offsetsA, (o: TuningNote, i: number) =>
      NoteUtils.TuningNotesAreEqual(o, offsetsB[i])
    );
  };

  static NoteArrayToString(notes: Note[]): string[] {
    return map(notes, (n) => n.Label);
  }

  static NoteValueToString(value: NoteValue): string {
    switch (value) {
      case NoteValue.A:
        return 'A';
      case NoteValue.B:
        return 'B';
      case NoteValue.C:
        return 'C';
      case NoteValue.D:
        return 'D';
      case NoteValue.E:
        return 'E';
      case NoteValue.F:
        return 'F';
      case NoteValue.G:
        return 'G';
      default:
        return null;
    }
  }

  static NaturalNoteValues(): NoteValue[] {
    return [
      NoteValue.A,
      NoteValue.B,
      NoteValue.C,
      NoteValue.D,
      NoteValue.E,
      NoteValue.F,
      NoteValue.G,
    ];
  }

  static StandardNotes(): Note[] {
    return [
      Note.C(),
      Note.C().Sharp(),
      // Note.D().Flat(),
      Note.D(),
      Note.D().Sharp(),
      // Note.E().Flat(),
      Note.E(),
      Note.F(),
      Note.F().Sharp(),
      // Note.G().Flat(),
      Note.G(),
      Note.G().Sharp(),
      // Note.A().Flat(),
      Note.A(),
      Note.A().Sharp(),
      // Note.B().Flat(),
      Note.B(),
    ];
  }
}
