import * as React from 'react';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import {
  FormAction,
  FormMode,
  InlineOptionsForm,
  OptionCard,
  OptionCardProps,
} from '..';
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

  const [pending, setPending] = useState<Instrument>(instrument);

  const [formMode, setFormMode] = useState<FormMode>(FormMode.Select);

  const { req: createInstrument } = useRequest(new InstrumentApi().CreateAsync);
  const { req: getInstruments, data: instruments } = useRequest(
    new InstrumentApi().GetAllAsync
  );

  useEffect(() => {
    getInstruments();
  }, []);

  useEffect(() => {
    if (!rest.active && formMode != FormMode.Select) {
      handleFormAction(FormAction.Cancel);
    }
  }, [rest.active]);

  const saveEdit = () => {
    if (
      (!!pending.Id && pending.Label != instrument.Label) ||
      pending.NumStrings != instrument.NumStrings ||
      pending.NumFrets != instrument.NumFrets
    ) {
      new InstrumentApi().PatchAsync(pending).then((saved) => {
        if (!!saved.success) {
          setInstrument({ ...saved.result, NumFrets: instrument.NumFrets });
          getInstruments();
        }
      });
    }
  };

  const saveCreate = () => {
    createInstrument(pending).then((created: Instrument) => {
      if (!!created) {
        setInstrument(created);
        getInstruments();
      }
    });
  };

  const handleFormAction = (action: FormAction) => {
    if (action == FormAction.Edit) {
      setPending({ ...instrument });
      setFormMode(FormMode.Edit);
    } else if (action == FormAction.Create) {
      setPending({ ...instrument, Id: null, Label: 'New Instrument', DefaultTuning: null, DefaultTuningId: null });
      setFormMode(FormMode.Create);
    } else if (action == FormAction.Confirm) {
      if (formMode === FormMode.Edit) {
        saveEdit();
        setFormMode(FormMode.Select);
      } else if (formMode === FormMode.Create) {
        saveCreate();
        setFormMode(FormMode.Select);
      }
    } else if (action == FormAction.Cancel) {
      setFormMode(FormMode.Select);
    }
  };

  const handleSetInstrument = (updated: Instrument) => {
    setInstrument({
      ...updated,
      NumFrets: instrument.NumFrets,
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
      <InlineOptionsForm
        current={formMode == FormMode.Select ? instrument : pending}
        mode={formMode}
        options={instruments}
        onAction={handleFormAction}
        setCurrent={
          formMode == FormMode.Select ? handleSetInstrument : handleSetPending
        }
      />
      <Form inline>
        <Form.Label className="my-1 mr-2">
          <small>Strings</small>
        </Form.Label>
        <Form.Control
          disabled={formMode == FormMode.Select}
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
      Default Tuning: {instrument.DefaultTuning?.Label}
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
