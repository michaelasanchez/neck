import { faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { countBy, filter, findIndex, isUndefined, map } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { OptionCard, OptionCardProps } from '..';
import {
  Instrument,
  Note,
  NoteValue,
  Tuning,
  TuningNote,
} from '../../../models';
import { TuningApi } from '../../../network';
import { DropOver, DropOverOption } from '../DropOver';

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

  const [editing, setEditing] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const labelRef = useRef();

  useEffect(() => {
    reloadTunings();
  }, [instrument]);

  useEffect(() => {
    setEditing(false);
  }, [rest.active]);

  useEffect(() => {
    if (editing && !!labelRef.current) {
      // Begin edit
      // const labelInput = labelRef.current as HTMLInputElement;
      // labelInput.focus();

      setPending({ ...tuning, Offsets: [...tuning.Offsets] });
    } else if (!editing && !!pending) {
      // Detect changes
      const offsetsMatch = map(pending.Offsets, (o: TuningNote, i: number) => {
        return (
          o.Pitch == tuning.Offsets[i].Pitch &&
          o.Octave == tuning.Offsets[i].Octave
        );
      });

      // Save
      if (
        pending.Label != tuning.Label ||
        filter(offsetsMatch, (m) => m == false).length > 0
      ) {
        setLoading(true);
        new TuningApi().Patch(pending).then((saved) => {
          setTuning(saved);
          setLoading(false);
        });
      }
    }
  }, [editing]);

  const reloadTunings = () => {
    new TuningApi().ByInstrument(instrument.Id).then((tunings) => {
      setTunings(tunings);
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

  const body = (current: Tuning) => (
    <>
      <div className="tuning-actions">
        {editing ? (
          <Form.Control
            value={current.Label}
            ref={labelRef}
            onChange={(e) => handleSetPending({ Label: e.target.value })}
          />
        ) : (
          <DropdownButton
            id="tuning-select"
            variant="outline-secondary"
            title={current.Label}
            disabled={editing}
          >
            {map(tunings, (t, i) => (
              <Dropdown.Item
                eventKey={i.toString()}
                key={i}
                active={t.Id === current.Id}
                onClick={(e: React.BaseSyntheticEvent) => setTuning(t)}
              >
                {t.Label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        )}
        <Button
          variant={editing ? 'secondary' : 'outline-secondary'}
          onClick={() => setEditing(!editing)}
        >
          <FontAwesomeIcon icon={editing ? farEdit : faEdit} />
        </Button>
      </div>
      <div className="tuning-selector">
        {map(current.Offsets, (o, j) => {
          return (
            <DropOver
              disabled={!editing}
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
      body={body(editing && !!pending ? pending : tuning)}
      eventKey={eventKey}
    />
  );
};