import { each, filter, findIndex, indexOf, map } from 'lodash';
import * as React from 'react';
import { useState } from 'react';

import { Note, NoteValue } from '../models';
import { NoteUtils } from '../shared';

export interface INoteSelectionProps {
  notes: Note[];
  selected: NoteValue[];
  setSelected: (v: NoteValue) => void;
}

const naturalNoteValues = NoteUtils.NaturalNoteValues();

export const NoteSelection: React.FC<INoteSelectionProps> = ({
  notes,
  selected,
  setSelected,
}) => {
  let rootIndex: number;
  if (!!notes && notes.length > 0) {
    rootIndex = findIndex(naturalNoteValues, (n) => n == notes[0].Base);
  }

  return (
    <div className="note-selection">
      <label>Notes:</label>
      {rootIndex &&
        map(naturalNoteValues, (v: NoteValue, i: number) => {
          //
          const shiftedNoteValue =
            naturalNoteValues[
              (i + rootIndex + naturalNoteValues.length) %
                naturalNoteValues.length
            ];

          const currentSelected = indexOf(selected, shiftedNoteValue) > -1;
          const activeValue = filter(notes, (n) => n.Base == shiftedNoteValue);

          if (activeValue.length == 1) {
            return (
              <span
                key={i}
                className={`active ${currentSelected ? 'selected' : ''}`}
                onClick={() => setSelected(shiftedNoteValue)}
              >
                {activeValue[0].Label}
              </span>
            );
          }

          return (
            <span key={i}>{NoteUtils.NoteValueToString(shiftedNoteValue)}</span>
          );
        })}
    </div>
  );
};
