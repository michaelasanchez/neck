import { map } from "lodash";
import { Chord, ChordType, Key, Mode, Note, NoteSuffixLabel, Scale } from ".";

const noteLabelsFromChord = (note: Note): string[] => {
  const chord = new Chord(note, ChordType.Major);
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
