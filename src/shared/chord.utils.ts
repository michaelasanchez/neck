import { filter, map, reduce, times } from "lodash";

import { Chord, ChordVariation, Note, Tuning } from "../models";

export const VARIATION_OFFSET_DEFAULT = 0;
export const VARIATION_SPAN_DEFAULT = 4;

export const VARIATION_SPAN_INCLUDES_OPEN = false;

export class ChordUtils {

  static toString(notes: Note[]): string[] {
    return map(notes, (n) => n.Label);
  }

  // Returns a fret number based on a Note, tuning
  //  offset and an optional minimum fret position
  static calcNotePosition = (
    note: Note,
    tuning: number,
    min: number = 0
  ): number => {
    let pos = (note.Modified - tuning + Note.NUM_NOTES) % Note.NUM_NOTES;
    while (pos < min) pos += Note.NUM_NOTES;
    return pos;
  };

  // Returns an array of all possible note positions,
  //  within a specified range, that form a chord
  static calcVariations = (
    chord: Chord,
    tuning: Tuning,
    offset: number = VARIATION_OFFSET_DEFAULT,
    span: number = VARIATION_SPAN_DEFAULT
  ): ChordVariation[] => {
    // Matches will contain a set of notes for each string / tuning offset
    //  Each note is a component of chord
    if (offset === 0 && VARIATION_SPAN_INCLUDES_OPEN) span++;
    const matches: Note[][] = map(tuning.Offsets, (o: number, i: number) => {
      return filter(chord.Factors, (n) => {
        let pos = ChordUtils.calcNotePosition(n, o, offset);
        return pos >= offset && pos <= offset + (span - 1);
      });
    });

    // Calculate number of combinations from matched notes
    const potentialNotes = map(matches, (m) => m.length);
    const numVariations = reduce(potentialNotes, (acc, n) => acc * n);

    // Calculate variations
    let variations: ChordVariation[] = [];
    times(numVariations, (n) => {
      let multiplier = 1;
      const positions = map(potentialNotes, (p, i) => {
        const prev = multiplier;
        multiplier *= p;

        const index = Math.floor(n / prev) % p;
        return ChordUtils.calcNotePosition(matches[i][index], tuning.Offsets[i], offset);
      });

      variations.push(new ChordVariation(positions, chord, tuning));
    });

    return variations;
  };

}

