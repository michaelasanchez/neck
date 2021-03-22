import { filter, findIndex, isUndefined, map } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { EditMode, OptionCard, OptionCardProps } from '..';
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
import { InlineOptionsForm } from './InlineOptionsForm';

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

  const [tunings, setTunings] = useState<Array<Tuning>>();

  const [pending, setPending] = useState<Tuning>();

  const [editMode, setEditMode] = useState<EditMode>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { req: createTuning } = useRequest(new TuningApi().CreateAsync);

  useEffect(() => {
    if (!!instrument) {
      reloadTunings();
    }
  }, [instrument]);

  // TODO: do we need this?
  useEffect(() => {
    setEditMode(null);
  }, [rest.active]);

  useEffect(() => {
    if (editMode === EditMode.Create) {
      setPending(
        new Tuning(instrument.Id, 'New Tuning', [
          ...instrument.DefaultTuning.Offsets,
        ])
      );
    } else if (editMode === EditMode.Edit) {
      setPending({ ...tuning, Offsets: [...tuning.Offsets] });
    }
  }, [editMode]);

  const reloadTunings = () => {
    setLoading(true);
    new TuningApi().ByInstrument(instrument.Id).then((tunings) => {
      setTunings(tunings);
      setLoading(false);
    });
  };

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

  const handleSetEditMode = (nextMode: EditMode) => {
    if (nextMode !== null) {
      setPending(tuning)
      setEditMode(nextMode);
    } else {
      setLoading(true);
      if (editMode === EditMode.Edit) {
        // Detect changes
        const offsetsMatch = map(
          pending.Offsets,
          (o: TuningNote, i: number) => {
            return (
              o.Pitch == tuning.Offsets[i].Pitch &&
              o.Octave == tuning.Offsets[i].Octave
            );
          }
        );

        // Save
        if (
          (!!pending.Id && pending.Label != tuning.Label) ||
          filter(offsetsMatch, (m) => m == false).length > 0
        ) {
          // Update
          new TuningApi().PatchAsync(pending).then((saved) => {
            if (!!saved.success) {
              setTuning(saved.result);
              reloadTunings();
            }
          });
        }
      } else {
        // Create
        createTuning(pending).then((created: Tuning) => {
          if (!!created) {
            setTuning(created);
            reloadTunings();
          }
        });
      }

      setPending(null);
      setEditMode(null);
    }
  };

  const body = (current: Tuning) => (
    <>
      <div className="tuning-actions">
        <InlineOptionsForm
          current={editMode == null ? tuning : pending }
          mode={editMode}
          options={tunings}
          setMode={handleSetEditMode}
          setCurrent={editMode == null ? setTuning : handleSetPending}
        />
      </div>
      <div className="tuning-selector">
        {map(current.Offsets, (o, j) => {
          return (
            <DropOver
              disabled={editMode === null}
              currentIndex={findIndex(
                tuningNoteOptions,
                (n) => n.value.Pitch === o.Pitch && n.value.Octave === o.Octave
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
      body={body(editMode !== null && !!pending ? pending : tuning)}
      eventKey={eventKey}
    />
  );
};
