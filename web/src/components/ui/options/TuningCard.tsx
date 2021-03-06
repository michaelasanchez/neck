import { faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIndex, map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { OptionCard, OptionCardProps } from '..';
import { Instrument, Tuning, TuningNote } from '../../../models';
import { TuningApi } from '../../../network';
import { DropOver, DropOverOption } from '../DropOver';

export interface TuningCardOptions extends Pick<OptionCardProps, 'active'> {
  eventKey: string;
  instrument: Instrument;
  tuning: Tuning;
  setTuning: (t: Tuning) => void;
}

export const TuningCard: React.FunctionComponent<TuningCardOptions> = (
  props
) => {
  const { eventKey, instrument, tuning, setTuning, ...rest } = props;

  const [tunings, setTunings] = useState<Array<Tuning>>();

  const [editing, setEditing] = useState<boolean>();

  useEffect(() => {
    reloadTunings();
  }, [instrument]);

  const reloadTunings = () => {
    new TuningApi().ByInstrument(instrument.Id).then((tunings) => {
      setTunings(tunings);
    });
  };

  const tuningNotes = (t: Tuning) =>
    map(t.Offsets, (o) => {
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

  const body = (
    <>
      <div className="tuning-actions">
        <DropdownButton
          id="tuning-select"
          variant="outline-secondary"
          title={tuning.Label}
        >
          {map(tunings, (t, i) => (
            <Dropdown.Item
              eventKey={i.toString()}
              key={i}
              active={t.Id === tuning.Id}
              onClick={(e: React.BaseSyntheticEvent) => setTuning(t)}
            >
              {t.Label}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Button
          variant={editing ? 'secondary' : 'outline-secondary'}
          onClick={() => setEditing(!editing)}
        >
          <FontAwesomeIcon icon={editing ? farEdit : faEdit} />
        </Button>
      </div>
      <div className="tuning-selector">
        {map(tuning.Offsets, (o, j) => {
          const options = tuningNotes(tuning);
          return (
            <DropOver
              disabled={!editing}
              currentIndex={findIndex(
                options,
                (n) => n.value.Pitch === o.Pitch && n.value.Octave === o.Octave
              )}
              key={j}
              id={j.toString()}
              options={options}
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
      body={body}
      eventKey={eventKey}
    />
  );
};
