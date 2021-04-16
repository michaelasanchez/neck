import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { FretNote, TuningNote } from '../../../models';

interface SearchNoteProps {
  note: FretNote;
  updateMatrix: (tuningNote: TuningNote) => void;
}

export const SearchNote: React.FunctionComponent<SearchNoteProps> = (props) => {
  const { note, updateMatrix } = props;
  return (
    <>
      <div className="search-note" onClick={() => updateMatrix(note.Note)}>
        {note.Note?.Label}
        <button className="close">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </>
  );
};
