import { map } from "lodash";
import { Note } from "../models";

export class NoteUtils {

  static toString(notes: Note[]): string[] {
    return map(notes, (n) => n.Label);
  }

}