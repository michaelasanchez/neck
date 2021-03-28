import {
  faExclamationCircle,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { every, filter, findIndex, isUndefined, map, times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { FormAction, OptionCard, OptionCardProps } from '..';
import { useNotificationContext } from '../..';
import { useRequest } from '../../../hooks';
import { NotificationType } from '../../../interfaces';
import {
  Instrument,
  Note,
  NoteValue,
  Tuning,
  TuningNote,
} from '../../../models';
import { TuningApi } from '../../../network';
import { DropOver, DropOverOption } from '../DropOver';
import { FormMode, InlineOptionsForm } from './InlineOptionsForm';

const incompleteTuningMessage = "Tuning is incomplete :'(";
const missingTuningMessage = 'Tuning is missing!';

export interface TuningCardOptions extends Pick<OptionCardProps, 'active'> {
  eventKey: string;
  instrument: Instrument;
  tuning: Tuning;
  setTuning: (t: Tuning) => void;
}

const calcOptions = (start: TuningNote, end: TuningNote) => {
  const options = [];
  let current = start;

  const limit = 50;

  while (
    options.length < limit &&
    (current.Pitch != end.Pitch || current.Octave <= end.Octave)
  ) {
    options.push(current);

    let nextValue = current.Pitch + 1;
    let nextSuffix = 0;
    if (isUndefined(NoteValue[nextValue % Note.NUM_NOTES])) {
      nextValue = current.Pitch;
      nextSuffix = 1;
    }
    let nextOctave =
      nextValue >= Note.NUM_NOTES ? current.Octave + 1 : current.Octave;
    current = new TuningNote(nextValue, nextSuffix, nextOctave);
  }

  return options;
};

const mapOptions = (
  notes: Array<TuningNote>
): Array<DropOverOption<TuningNote>> => {
  return map(notes, (o) => {
    return {
      label: (
        <span>
          {o.Label}
          <sub>{o.Octave}</sub>
        </span>
      ),
      value: o,
    } as DropOverOption<TuningNote>;
  });
};

const tuningNotes = calcOptions(
  new TuningNote(0, 0, 2),
  new TuningNote(0, 0, 5)
);

const tuningNoteOptions = mapOptions(tuningNotes);

const newTuning = (instrument: Instrument): Tuning => {
  return {
    ...instrument?.DefaultTuning,
    Id: null,
    InstrumentId: instrument.Id,
    Label: 'New Tuning',
    Offsets: !!instrument?.DefaultTuning
      ? [...instrument.DefaultTuning.Offsets]
      : times(instrument.NumStrings, (s) => null), //new Array<TuningNote>(instrument.NumStrings),
  };
};

export const TuningCard: React.FunctionComponent<TuningCardOptions> = (
  props
) => {
  const { eventKey, instrument, tuning, setTuning, ...rest } = props;

  const [formMode, setFormMode] = useState<FormMode>(FormMode.Select);
  const [pending, setPending] = useState<Tuning>();

  const { addNotification } = useNotificationContext();

  const { req: createTuning } = useRequest(new TuningApi().CreateAsync);
  const { req: getTunings, data: tunings } = useRequest(
    new TuningApi().ByInstrument
  );

  useEffect(() => {
    if (!rest.active && formMode != FormMode.Select) {
      handleFormAction(FormAction.Cancel);
    }
  }, [rest.active]);

  useEffect(() => {
    if ((!!instrument && !tunings) || instrument.Id != tuning?.InstrumentId) {
      getTunings(instrument.Id);
    }
  }, [instrument]);

  const handleSetPending = (updated: Partial<Tuning>) => {
    setPending({
      ...pending,
      Offsets: [...(updated?.Offsets || pending.Offsets)],
      Label: updated?.Label || pending.Label,
    });
  };

  const handleSetOffset = (index: number, note: TuningNote) => {
    pending.Offsets[index] = note;
    handleSetPending({ Offsets: [...pending.Offsets] });
  };

  const saveEdit = () => {
    // Detect changes
    const offsetsMatch = map(pending.Offsets, (o: TuningNote, i: number) => {
      const offset = tuning.Offsets[i];
      if (!offset) return false;
      return o.Pitch == offset.Pitch && o.Octave == offset.Octave;
    });

    // Save
    if (
      (!!pending.Id && pending.Label != tuning.Label) ||
      filter(offsetsMatch, (m) => m == false).length > 0
    ) {
      // Update
      new TuningApi().PatchAsync(pending).then((saved) => {
        if (!!saved.success) {
          setTuning(saved.result);
          getTunings(instrument.Id);
        }
      });
    }
  };

  const saveCreate = () => {
    createTuning(pending).then((created: Tuning) => {
      if (!!created) {
        setTuning(created);
        getTunings(instrument.Id);
      }
    });
  };

  const handleFormAction = (action: FormAction) => {
    if (action == FormAction.Edit) {
      setPending({
        ...tuning,
        Offsets: tuning.Offsets.length
          ? [...tuning.Offsets]
          : times(instrument.NumStrings, (s) => null),
      });
      setFormMode(FormMode.Edit);
    } else if (action == FormAction.Create) {
      setPending(newTuning(instrument));
      setFormMode(FormMode.Create);
    } else if (action == FormAction.Confirm) {
      // TODO: hopefully a placeholder fix for breaking the backend
      //  saving a list containing null THE SECOND TIME throws NRE
      if (!every(pending.Offsets, (o) => o != null)) {
        addNotification(
          'Tuning cannot contain empty offsets.',
          NotificationType.Warning
        );
      } else {
        if (formMode === FormMode.Edit) {
          saveEdit();
        } else if (formMode === FormMode.Create) {
          saveCreate();
        }
        setFormMode(FormMode.Select);
      }
    } else if (action == FormAction.Cancel) {
      setFormMode(FormMode.Select);
    }
  };

  console.log('tunings', tunings)

  const messages = (
    <div className="text-center mb-3">
      {tuning?.Offsets.length <= 0 && (
        <>
          <span className="text-warning">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mx-2" />
          </span>
          {incompleteTuningMessage}
        </>
      )}
      {/* {tunings?.length <= 0 && (
        <>
          <span className="text-danger">
            <FontAwesomeIcon icon={faExclamationCircle} className="mx-2" />
          </span>
          {missingTuningMessage}
        </>
      )} */}
    </div>
  );

  const body = (current: Tuning) => (
    <>
      <InlineOptionsForm
        current={formMode == FormMode.Select ? tuning : pending}
        mode={formMode}
        options={tunings}
        onAction={handleFormAction}
        setCurrent={formMode == FormMode.Select ? setTuning : handleSetPending}
      />
      {messages}
      <div className="tuning-selector">
        {times(instrument.NumStrings, (j) => {
          const offsets =
            formMode == FormMode.Select ? tuning?.Offsets : pending.Offsets;
          const o = !!offsets && j < offsets.length ? offsets[j] : null;

          return (
            <DropOver
              disabled={formMode === FormMode.Select}
              currentIndex={findIndex(
                tuningNoteOptions,
                (n) =>
                  n.value.Pitch === o?.Pitch && n.value.Octave === o?.Octave
              )}
              key={j}
              id={j.toString()}
              options={tuningNoteOptions}
              onChange={(o: TuningNote) => handleSetOffset(j, o)}
            />
          );
        })}
      </div>
    </>
  );

  return (
    <OptionCard
      {...rest}
      title="Tuning"
      subtitle={tuning?.Label || '(No Tuning)'}
      body={body(formMode == FormMode.Select ? tuning : pending)}
      eventKey={eventKey}
    />
  );
};
