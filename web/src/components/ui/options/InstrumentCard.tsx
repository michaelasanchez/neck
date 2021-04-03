import * as React from 'react';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import {
  OptionCardProps,
  FormMode,
  FormAction,
  CardAction,
  InlineOptionsForm,
  OptionCard,
} from '.';
import { CardKey } from '..';
import { useNotificationContext } from '../..';
import { useRequest } from '../../../hooks';
import { NotificationType } from '../../../interfaces';
import { Instrument } from '../../../models';
import { InstrumentApi } from '../../../network';

export interface InstrumentCardOptions
  extends Pick<OptionCardProps, 'active' | 'onAction'> {
  eventKey: string;
  instrument: Instrument;
  setInstrument: (i: Instrument) => void;
}

interface PendingInstrument
  extends Pick<
    Instrument,
    'Id' | 'Label' | 'DefaultTuning' | 'DefaultTuningId' | 'Formation'
  > {
  NumStrings: string;
  NumFrets: string;
}

const toPending = (instrument: Instrument) => {
  return {
    ...instrument,
    NumStrings: instrument?.NumStrings.toString(),
    NumFrets: instrument?.NumFrets.toString(),
  };
};

const fromPending = (pending: PendingInstrument): Instrument => {
  return {
    ...pending,
    NumStrings: parseInt(pending?.NumStrings),
    NumFrets: parseInt(pending?.NumFrets),
  };
};

const validatePending = (pending: PendingInstrument) => {
  const warnings = [];
  if (!pending?.Label) {
    warnings.push('Instrument name cannot be blank');
  }
  if (!pending?.NumStrings) {
    warnings.push('Strings cannot be empty');
  } else if (isNaN(parseInt(pending.NumStrings))) {
    warnings.push('String dimension must be a number');
  }
  if (!pending?.NumFrets) {
    warnings.push('Frets cannot be empty');
  } else if (isNaN(parseInt(pending.NumFrets))) {
    warnings.push('Fret dimension must be a number');
  } else if (parseInt(pending.NumFrets) > 48) {
    warnings.push('Fret dimension must be less than 48');
  }
  return warnings;
};

export const InstrumentCard: React.FunctionComponent<InstrumentCardOptions> = (
  props
) => {
  const {
    eventKey,
    instrument,
    setInstrument,
    onAction: performAction,
    ...rest
  } = props;

  const [pending, setPending] = useState<PendingInstrument>({
    ...instrument,
    NumStrings: instrument.NumStrings.toString(),
    NumFrets: instrument.NumFrets.toString(),
  });

  const [formMode, setFormMode] = useState<FormMode>(FormMode.Select);

  const { addNotification } = useNotificationContext();

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
      pending.NumStrings != instrument.NumStrings.toString()
    ) {
      new InstrumentApi().PatchAsync(pending).then((saved) => {
        if (!!saved.success) {
          handleSetInstrument(
            {
              ...saved.result,
              NumFrets: instrument.NumFrets,
            },
            true
          );
        }
      });
    }
  };

  const saveCreate = () => {
    createInstrument(pending).then((created: Instrument) => {
      if (!!created) {
        handleSetInstrument(created, true);
        performAction(CardAction.Open, CardKey.Tuning);
      }
    });
  };

  const handleFormAction = (action: FormAction) => {
    switch (action) {
      case FormAction.Edit:
        setPending(toPending(instrument));
        setFormMode(FormMode.Edit);
        break;
      case FormAction.Create:
        setPending(
          toPending({
            ...instrument,
            Id: null,
            DefaultTuning: null,
            DefaultTuningId: null,
            Label: 'New Instrument',
          })
        );
        setFormMode(FormMode.Create);
        break;
      case FormAction.Confirm:
        const warnings = validatePending(pending);
        if (warnings.length) {
          addNotification(warnings[0], NotificationType.Warning);
        } else {
          if (formMode === FormMode.Edit) {
            saveEdit();
            setFormMode(FormMode.Select);
          } else if (formMode === FormMode.Create) {
            saveCreate();
            setFormMode(FormMode.Select);
          }
        }
        break;
      case FormAction.Cancel:
        setFormMode(FormMode.Select);
        break;
    }
  };

  const handleSetInstrument = (
    updated: Instrument,
    refresh: boolean = false
  ) => {
    const next = {
      ...updated,
      NumFrets: updated?.NumFrets || instrument.NumFrets,
    };
    setInstrument(next);
    setPending(toPending(next));
    if (refresh) {
      getInstruments();
    }
  };

  const handleSetPending = (updated: Partial<PendingInstrument>) => {
    setPending({
      ...pending,
      Label: updated?.Label !== undefined ? updated.Label : pending.Label,
      NumStrings:
        updated.NumStrings != undefined
          ? updated.NumStrings
          : pending.NumStrings,
      NumFrets:
        updated.NumFrets != undefined ? updated.NumFrets : pending.NumFrets,
    });
  };

  const handleNumFretsUpdate = (updated: PendingInstrument) => {
    const warnings = validatePending(updated);
    if (warnings.length) {
      addNotification(warnings[0], NotificationType.Warning);
    } else if (formMode != FormMode.Create) {
      handleSetInstrument(fromPending(updated));
    }
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
      <h6>Dimensions</h6>
      <Form inline>
        <Form.Label className="my-1 mr-2">Strings</Form.Label>
        <Form.Control
          // TODO: This technically works for edit,
          //  but I think the old tuning is overwritten?
          disabled={formMode != FormMode.Create}
          value={pending?.NumStrings.toString()}
          onChange={(e: any) =>
            handleSetPending({ NumStrings: e.target.value })
          }
        />
        <Form.Label className="my-1 mr-2 ml-3">Frets</Form.Label>
        <Form.Control
          value={pending?.NumFrets.toString()}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
            handleNumFretsUpdate(pending)
          }
          onChange={(e: any) => handleSetPending({ NumFrets: e.target.value })}
          onKeyDown={(e: any) => {
            if (e.keyCode === 13) {
              handleNumFretsUpdate(pending);
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
