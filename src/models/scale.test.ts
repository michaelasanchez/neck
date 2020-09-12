import { Key, Scale, Note, Mode } from ".";
import { map } from "lodash";

const noteLabelsFromKey = (key: Key, mode: Mode = Mode.Ionian()): string[] => {
  return map(new Scale(key.Root, mode).Notes, n => n.Label);
}

test('major scale in key of c', () => {
  const notes = noteLabelsFromKey(Key.C())
  expect(notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
});