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

  const root = notes[0];
  const rootIndex = findIndex(naturalNoteValues, (n) => n == root.Base);

  return (
    <div className="note-selection">
      <label>Notes:</label>
      {map(naturalNoteValues, (v: NoteValue, i: number) => {
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
              onClick={() => setSelected(i)}
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
