import { map } from "lodash";
import { Chord, ChordModifier, Note, NoteSuffixLabel } from "../models";

const noteLabelsFromChord = (note: Note): string[] => {
  const chord = new Chord(note, ChordModifier.Major);
  return map(chord.Pitches, n => formatNoteLabel(n));
}

const formatNoteLabel = (note: Note): string => {
  return note.Label.replace(NoteSuffixLabel.Sharp, '#').replace(NoteSuffixLabel.Flat, 'b');
}

const majorChord = [
  [Note.C(), ['C', 'E', 'G']],
];
describe('major chord', () => {

  test.each(majorChord)(
    'in key of %s',
    (note: Note, expectedResult) => {
      const notes = noteLabelsFromChord(note)
      expect(notes).toEqual(expectedResult);
    }
  );
});
