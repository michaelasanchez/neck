import { each, filter, findIndex, map } from 'lodash';
import * as React from 'react';
import { Note, NoteValue } from '../models';
import { NoteUtils } from '../shared';

export interface INoteSelectionProps {
  notes: Note[];
}

const naturalNoteValues = NoteUtils.NaturalNoteValues();

export const NoteSelection: React.FC<INoteSelectionProps> = ({ notes }) => {
  // TODO: this will blow up one day
  const root = notes[0];
  const rootIndex = findIndex(naturalNoteValues, (n) => n == root.Base);

  // TODO: finish this
  const selected = 0;

  return (
    <div className="note-selection">
      Notes:{' '}
      {map(naturalNoteValues, (v: NoteValue, i: number) => {
        const shifted =
          naturalNoteValues[
            (i + rootIndex + naturalNoteValues.length) %
              naturalNoteValues.length
          ];

        var result = filter(notes, (n: Note, i: number) => n.Base == shifted);
        if (result.length == 1) {
          return (
            <small key={i} className={`font-weight-bold ${i == selected ? 'selected' : ''}`}>
              {result[0].Label}
            </small>
          );
        }

        return (
          <small className="font-weight-light `text-black-50" key={i}>
            {NoteUtils.NoteValueToString(shifted)}
          </small>
        );
      })}
    </div>
  );
};
