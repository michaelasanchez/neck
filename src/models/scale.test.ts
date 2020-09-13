import { map } from "lodash";
import { Key, Mode, Note, NoteSuffixLabel, Scale } from ".";

const noteLabelsFromKey = (key: Key, mode: Mode = Mode.Ionian()): string[] => {
  const scale = new Scale(key.Root, mode);
  return map(scale.Notes, n => formatNoteLabel(n));
}

const formatNoteLabel = (note: Note): string => {
  return note.Label.replace(NoteSuffixLabel.Sharp, '#').replace(NoteSuffixLabel.Flat, 'b');
}

const keys = [
  [Key.C().Flat(), ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb']],
  [Key.G().Flat(), ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F']],
  [Key.D().Flat(), ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C']],
  [Key.A().Flat(), ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G']],
  [Key.E().Flat(), ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D']],
  [Key.B().Flat(), ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A']],
  [Key.F(), ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']],
  [Key.C(), ['C', 'D', 'E', 'F', 'G', 'A', 'B']],
  [Key.G(), ['G', 'A', 'B', 'C', 'D', 'E', 'F#']],
  [Key.D(), ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']],
  [Key.A(), ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']],
  [Key.E(), ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#']],
  [Key.B(), ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']],
  [Key.F().Sharp(), ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#']],
  [Key.C().Sharp(), ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#']],
];

const theoreticalKeys = [
  [Key.G().Sharp(), ['G#', 'A#', 'B#', 'C#', 'D#', 'E#', 'F##']],
  [Key.D().Sharp(), ['D#', 'E#', 'F##', 'G#', 'A#', 'B#', 'C##']],
  [Key.A().Sharp(), ['A#', 'B#', 'C##', 'D#', 'E#', 'F##', 'G##']],
  [Key.E().Sharp(), ['E#', 'F##', 'G##', 'A#', 'B#', 'C##', 'D##']],
  [Key.B().Sharp(), ['B#', 'C##', 'D##', 'E#', 'F##', 'G##', 'A##']],
  [Key.F().DoubleSharp(), ['F##', 'G##', 'A##', 'B#', 'C##', 'D##', 'E##']],
  [Key.C().DoubleSharp(), ['C##', 'D##', 'E##', 'F##', 'G##', 'A##', 'B##']],
]

describe('major scale', () => {

  test.each(keys)(
    'in key of %s',
    (firstArg: Key, expectedResult) => {
      const notes = noteLabelsFromKey(firstArg)
      expect(notes).toEqual(expectedResult);
    }
  );

  // TODO: fix?
  // test.each(theoreticalKeys)(
  //   'in key of %s',
  //   (firstArg: Key, expectedResult) => {
  //     const notes = noteLabelsFromKey(firstArg)
  //     expect(notes).toEqual(expectedResult);
  //   }
  // );
});
