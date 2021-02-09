import { each, filter, findIndex, indexOf, keyBy, map } from 'lodash';
import * as React from 'react';
import { useState } from 'react';

import { Note, NoteValue } from '../models';
import { NoteUtils } from '../shared';

const ALLOW_MULTIPLE = true;

export interface INoteSelectionProps {
  notes: Note[];
  selected: Note[];
  setSelected: (v: Note[]) => void;
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

  const handleSelectedUpdate = (value: Note) => {
    if (!ALLOW_MULTIPLE) {
      if (selected.length && selected[0].Base == value.Base) {
        
        setSelected([]);
      } else {
        setSelected([value]);
      }
    } else {
      if (filter(selected, (v) => v.Base === value.Base).length) {
        selected.splice(findIndex(selected, n => n.Base === value.Base), 1);
      } else {
        selected.push(value);
      }
      setSelected([...selected]);
    }
  };

  return (
    <div className="note-selection">
      {rootIndex > -1 &&
        map(naturalNoteValues, (v: NoteValue, i: number) => {
          //
          const shiftedNoteValue =
            naturalNoteValues[
              (i + rootIndex + naturalNoteValues.length) %
                naturalNoteValues.length
            ];

          const currentSelected = findIndex(selected, n => n.Base === shiftedNoteValue) > -1;
          const activeValue = filter(notes, (n) => n.Base == shiftedNoteValue);

          // TODO:
          if (activeValue.length > 1) debugger;

          if (activeValue.length == 1) {
            return (
              <span
                key={i}
                className={`active ${currentSelected ? 'selected' : ''}`}
                onClick={() => handleSelectedUpdate(activeValue[0])}
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
