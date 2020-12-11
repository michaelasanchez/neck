import { filter, map } from 'lodash';
import * as React from 'react';

import { Note, NoteValue } from '../models';
import { NoteUtils } from '../shared';

export interface INoteSelectionProps {
  notes: Note[];
}

export const NoteSelection: React.FC<INoteSelectionProps> = ({ notes }) => {
  console.log('well hold on now', notes);
  return (
    <>
      Notes:{' '}
      {map(NoteUtils.NaturalNoteValues(), (v: NoteValue, i: number) => {
        
        var result = filter(notes, n => n.Base == v);
        if (result.length == 1) {
          return (
            <small key={i} className="font-weight-bold">{result[0].Label}</small>
          )
        }

        return (
          <small className="font-weight-light" key={i}>
            {NoteUtils.NoteValueToString(v)}
          </small>
        );
      })}
    </>
  );
};
