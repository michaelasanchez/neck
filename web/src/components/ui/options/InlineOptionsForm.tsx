import { faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';
import {
  faEdit,
  faEllipsisV,
  faPlus as faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map } from 'lodash';
import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { IApiEntity } from '../../../interfaces';

export interface InlineOptionsFormProps {
  mode: EditMode;
  options: IApiEntity[];
  current: IApiEntity;
  setMode: (updated: EditMode) => void;
  setCurrent: (updated: Partial<IApiEntity>) => void;
}

export enum EditMode {
  Edit,
  Create,
}

export const InlineOptionsForm: React.FunctionComponent<InlineOptionsFormProps> = ({
  mode,
  options,
  current,
  setMode,
  setCurrent,
}) => {
  const labelRef = useRef();

  useEffect(() => {
    if (mode === EditMode.Create) {
      if (!!labelRef.current) {
        const labelInput = labelRef.current as HTMLInputElement;
        labelInput.focus();
      }
    }
  }, [mode]);

  const labelSelect = useCallback(() => {
    return (
      <DropdownButton
        id="tuning-select"
        variant="outline-secondary"
        title={current.Label}
        className={mode != null ? 'hide' : ''}
      >
        {map(options, (t, i) => (
          <Dropdown.Item
            eventKey={i.toString()}
            key={i}
            active={t.Id === current.Id}
            onClick={(e: React.BaseSyntheticEvent) => setCurrent(t)}
          >
            {t.Label}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );
  }, [current, mode, options]);

  const labelEdit = useCallback(() => {
    return (
      <Form.Control
        value={current.Label}
        ref={labelRef}
        onChange={(e) => setCurrent({ Label: e.target.value })}
        className={mode == null ? 'hide' : ''}
      />
    );
  }, [current, mode]);

  return (
    <div className="options-form">
      {/* Select */}
      <div className="select-action">
        {labelSelect()}
        {mode != null && labelEdit()}
      </div>

      {/* Edit */}
      <Button
        variant={mode === EditMode.Edit ? 'secondary' : 'outline-secondary'}
        disabled={mode === EditMode.Create}
        onClick={() => setMode(mode !== EditMode.Edit ? EditMode.Edit : null)}
      >
        <FontAwesomeIcon icon={mode ? farEdit : faEdit} />
      </Button>

      {/* Menu */}
      <DropdownButton
        variant="outline-secondary"
        title={<FontAwesomeIcon icon={faEllipsisV} />}
        alignRight={true}
      >
        {/* Create */}
        <Dropdown.Item eventKey="1" key={1} className="create">
          <FontAwesomeIcon icon={faPlusCircle} />
          Create
        </Dropdown.Item>
        {/* Delete */}
        <Dropdown.Item eventKey="2" key={2} className="delete">
          <FontAwesomeIcon icon={faTrash} />
          Delete
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
};
