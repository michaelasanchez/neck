import { each, filter, findIndex, map } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { Note, NoteValue } from '../models';
import { NoteUtils } from '../shared';

export interface INoteSelectionProps {
  notes: Note[];
}

const naturalNoteValues = NoteUtils.NaturalNoteValues();

export const NoteSelection: React.FC<INoteSelectionProps> = ({ notes }) => {
  const [selected, setSelected] = useState<number>(0);

  let rootIndex: number;
  if (!!notes && notes.length > 0) {
    console.log('NOTESLSKNSDLF', notes);
    rootIndex = findIndex(naturalNoteValues, (n) => n == notes[0].Base);
  }

  return (
    <div className="note-selection">
      <label>Notes:</label>
      {rootIndex && map(naturalNoteValues, (v: NoteValue, i: number) => {
        const shifted =
          naturalNoteValues[
            (i + rootIndex + naturalNoteValues.length) %
              naturalNoteValues.length
          ];

        var result = filter(notes, (n: Note, i: number) => n.Base == shifted);
        if (result.length == 1) {
          return (
            <span
              key={i}
              className={`active ${i == selected ? 'selected' : ''}`}
              onClick={() => i == selected ? setSelected(null) : setSelected(i)}
            >
              {result[0].Label}
            </span>
          );
        }

        return <span key={i}>{NoteUtils.NoteValueToString(shifted)}</span>;
      })}
    </div>
  );
};
