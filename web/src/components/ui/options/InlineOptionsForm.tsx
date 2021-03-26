import * as $ from 'jquery';
import { faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faEdit,
  faEllipsisV,
  faPlus as faPlusCircle,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map } from 'lodash';
import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { IApiEntity } from '../../../interfaces';

export interface InlineOptionsFormProps {
  mode: FormMode;
  options: IApiEntity[];
  current: IApiEntity;
  onAction: (updated: FormAction) => void;
  setCurrent: (updated: Partial<IApiEntity>) => void;
}

export enum FormAction {
  Edit,
  Create,
  Confirm,
  Cancel,
}

export enum FormMode {
  Select,
  Edit,
  Create,
}

const hiddenActionsStyle: React.CSSProperties = {
  position: 'absolute',
  transform: 'translateY(100%)',
  opacity: 0,
};

export const InlineOptionsForm: React.FunctionComponent<InlineOptionsFormProps> = ({
  mode,
  options,
  current,
  onAction: performAction,
  setCurrent,
}) => {
  const labelSelect = useCallback(() => {
    return (
      <DropdownButton
        id="tuning-select"
        variant="outline-secondary"
        title={current?.Label || 'None'}
        className={mode != FormMode.Select ? 'hide' : ''}
        disabled={!options?.length}
      >
        {map(options, (t, i) => (
          <Dropdown.Item
            eventKey={i.toString()}
            key={i}
            active={t.Id === current?.Id}
            onClick={(e: React.BaseSyntheticEvent) => setCurrent(t)}
          >
            {t.Label}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );
  }, [current, mode, options]);

  return (
    <div className="options-form">
      {/* Select */}
      <div className="select-action">
        {labelSelect()}
        {mode != FormMode.Select && (
          <Form.Control
            value={current?.Label}
            onChange={(e) => setCurrent({ Label: e.target.value })}
            // className={mode == FormMode.Select ? 'hide' : ''}
            autoFocus={true}
          />
        )}
      </div>

      <div className="actions-container">
        <div
          className={`mode-actions${mode === FormMode.Select ? '' : ' hidden'}`}
          //   style={mode === null ? {} : hiddenActionsStyle}
        >
          {/* Edit */}
          <Button
            variant={'outline-secondary'}
            disabled={mode === FormMode.Create || !options?.length}
            onClick={() => performAction(FormAction.Edit)}
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
            <Dropdown.Item
              eventKey="1"
              key={1}
              className="create"
              onClick={() => performAction(FormAction.Create)}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              Create
            </Dropdown.Item>
            {/* Delete */}
            <Dropdown.Item
              eventKey="2"
              key={2}
              className="delete"
              disabled={true}
            >
              <FontAwesomeIcon icon={faTrash} />
              Delete
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <div
          className={`confirm-actions${
            mode !== FormMode.Select ? '' : ' hidden'
          }`}
        >
          {/* Confirm */}
          <Button
            variant={'outline-success'}
            onClick={() => performAction(FormAction.Confirm)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          {/* Cancel */}
          <Button
            variant={'outline-danger'}
            onClick={() => performAction(FormAction.Cancel)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      </div>
    </div>
  );
};
