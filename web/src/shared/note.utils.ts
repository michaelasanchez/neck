import { map } from "lodash";
import { Note, NoteValue } from "../models";

export class NoteUtils {

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

}