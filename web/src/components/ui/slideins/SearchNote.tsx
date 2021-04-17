import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { FretNote, TuningNote } from '../../../models';

interface SearchNoteProps {
  note: FretNote;
  onClose: () => void;
}

export const SearchNote: React.FunctionComponent<SearchNoteProps> = (props) => {
  const { note, onClose: handleClose } = props;
  return (
    <>
      <div className="search-note">
        {note?.Label}
        <button className="close" onClick={() => handleClose()}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </>
  );
};
