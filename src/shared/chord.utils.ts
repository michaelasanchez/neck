import { map } from "lodash";
import { Note } from "../models";

export class ChordUtils {

  static toString(notes: Note[]): string[] {
    return map(notes, (n) => n.Label);
  }

}