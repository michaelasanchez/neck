import { faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';
import {
  faEdit,
  faPlus as faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { FormAction, OptionCard, OptionCardProps } from '..';
import { useRequest } from '../../../hooks';
import { Instrument } from '../../../models';
import { InstrumentApi } from '../../../network';

export interface InstrumentCardOptions extends Pick<OptionCardProps, 'active'> {
  eventKey: string;
  instrument: Instrument;
  setInstrument: (i: Instrument) => void;
}

export const InstrumentCard: React.FunctionComponent<InstrumentCardOptions> = (
  props
) => {
  const { eventKey, instrument, setInstrument, ...rest } = props;

  const [instruments, setInstruments] = useState<Array<Instrument>>();
  const [pending, setPending] = useState<Instrument>(instrument);

  const [editMode, setEditMode] = useState<FormAction>(null);

  const { req: getInstruments } = useRequest(new InstrumentApi().GetAllAsync);

  useEffect(() => {
    reloadInstruments();
  }, []);

  const handleSetEditMode = (nextMode: FormAction) => {
    setEditMode(nextMode);
  };

  const reloadInstruments = () => {
    getInstruments().then((instruments) => {
      if (!!instruments) {
        setInstruments(instruments);
      }
    });
  };

  const handleSetPending = (updated: Partial<Instrument>) => {
    setPending({
      ...pending,
      Label: updated?.Label || pending.Label,
      NumStrings: updated?.NumStrings || pending.NumStrings,
      NumFrets: updated.NumFrets || pending.NumFrets,
    });
  };

  const handleUpdateNumFrets = (numFrets: number) => {
    instrument.NumFrets = numFrets;
    setInstrument(instrument);
  };

  const body = (
    <>
      <div className="instrument-actions">
        {editMode !== null ? (
          <Form.Control
            value={instrument.Label}
            // ref={labelRef}
            onChange={(e) => handleSetPending({ Label: e.target.value })}
          />
        ) : (
          <DropdownButton
            id="instrument-select"
            variant="outline-secondary"
            title={instrument.Label}
          >
            {map(instruments, (i, j) => (
              <Dropdown.Item
                eventKey={j.toString()}
                key={j}
                active={i.Id === instrument.Id}
                onClick={() =>
                  setInstrument({ ...i, NumFrets: instrument.NumFrets })
                }
              >
                {i.Label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        )}
        {/* Edit */}
        <Button
          variant={
            editMode === FormAction.Edit ? 'secondary' : 'outline-secondary'
          }
          disabled={editMode === FormAction.Create}
          onClick={() =>
            handleSetEditMode(editMode !== FormAction.Edit ? FormAction.Edit : null)
          }
        >
          <FontAwesomeIcon icon={editMode ? farEdit : faEdit} />
        </Button>
        {/* Create */}
        <Button
          variant={
            editMode === FormAction.Create ? 'success' : 'outline-secondary'
          }
          disabled={editMode === FormAction.Edit}
          onClick={() =>
            handleSetEditMode(
              editMode !== FormAction.Create ? FormAction.Create : null
            )
          }
        >
          <FontAwesomeIcon icon={faPlusCircle} />
        </Button>
      </div>
      <Form inline>
        <Form.Label className="my-1 mr-2">
          <small>Strings</small>
        </Form.Label>
        <Form.Control
          disabled={true} // TODO: finish this
          value={pending?.NumStrings.toString()}
          onChange={(e: any) =>
            handleSetPending({ NumStrings: parseInt(e.target.value) })
          }
          size={'sm'}
        />
        <Form.Label className="my-1 mr-2 ml-3">
          <small>Frets</small>
        </Form.Label>
        <Form.Control
          value={pending?.NumFrets.toString()}
          size={'sm'}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
            handleUpdateNumFrets(parseInt(e.target.value))
          }
          onChange={(e: any) =>
            handleSetPending({ NumFrets: parseInt(e.target.value) })
          }
          onKeyDown={(e: any) => {
            if (e.keyCode === 13) {
              handleUpdateNumFrets(parseInt(e.target.value));
              e.target.blur();
            }
          }}
        />
      </Form>
    </>
  );

  return (
    <OptionCard
      {...rest}
      title="Instrument"
      subtitle={instrument.Label}
      body={body}
      eventKey={eventKey}
    />
  );
};
