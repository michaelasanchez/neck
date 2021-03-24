import { filter, findIndex, isUndefined, map, times } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { FormAction, OptionCard, OptionCardProps } from '..';
import { useRequest } from '../../../hooks';
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

export const TuningCard: React.FunctionComponent<TuningCardOptions> = (
  props
) => {
  const { eventKey, instrument, tuning, setTuning, ...rest } = props;

  // const [tunings, setTunings] = useState<Tuning[]>();
  const [pending, setPending] = useState<Tuning>();

  const [formMode, setFormMode] = useState<FormMode>(FormMode.Select);

  const { req: createTuning } = useRequest(new TuningApi().CreateAsync);
  const { req: getTunings, data: tunings } = useRequest(new TuningApi().ByInstrument);

  useEffect(() => {
    if (!!instrument) {
      getTunings(instrument.Id);
    }
  }, [instrument]);

  const handleSetPending = (updated: Partial<Tuning>) => {
    setPending({
      ...pending,
      Offsets: updated?.Offsets || pending.Offsets,
      Label: updated?.Label || pending.Label,
    });
  };

  const handleSetOffset = (index: number, note: TuningNote) => {
    pending.Offsets[index] = note;
    handleSetPending({ Offsets: pending.Offsets });
  };

  const saveEdit = () => {
    // Detect changes
    const offsetsMatch = map(pending.Offsets, (o: TuningNote, i: number) => {
      const offset = tuning.Offsets[i];
      if (!offset) return false;
      return (
        o.Pitch == tuning.Offsets[i].Pitch &&
        o.Octave == tuning.Offsets[i].Octave
      );
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
    console.log('pending bro', pending)
    createTuning(pending).then((created: Tuning) => {
      if (!!created) {
        setTuning(created);
        getTunings(instrument.Id);
      }
    });
  };

  const handleFormAction = (action: FormAction) => {
    if (action == FormAction.Edit) {
      setPending({ ...tuning, Offsets: [...tuning.Offsets] });
      setFormMode(FormMode.Edit);
    } else if (action == FormAction.Create) {
      setPending({ ...instrument.DefaultTuning, Id: null, Label: 'New Tuning' });
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

  const body = (current: Tuning) => (
    <>
      <InlineOptionsForm
        current={formMode == FormMode.Select ? tuning : pending}
        mode={formMode}
        options={tunings}
        onAction={handleFormAction}
        setCurrent={formMode == FormMode.Select ? setTuning : handleSetPending}
      />
      <div className="tuning-selector">
        {times(instrument.NumStrings, j => {

          const offsets = formMode == FormMode.Select ? tuning.Offsets : pending.Offsets;
          const o = j < offsets.length
            ? offsets[j]
            : null;

          return (
            <DropOver
              disabled={formMode === FormMode.Select}
              currentIndex={findIndex(
                tuningNoteOptions,
                (n) => n.value.Pitch === o?.Pitch && n.value.Octave === o?.Octave
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
      subtitle={tuning.Label}
      body={body(formMode !== null && !!pending ? pending : tuning)}
      eventKey={eventKey}
    />
  );
};
