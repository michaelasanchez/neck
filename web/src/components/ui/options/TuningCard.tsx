import { findIndex, map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
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

  useEffect(() => {
    reloadTunings();
  }, [instrument]);

  const reloadTunings = () => {
    new TuningApi().ByInstrument(instrument.Id).then((tunings) => {
      setTunings(tunings);
    });
  };

  const tuningNotes = map(tuning.Offsets, (o) => {
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
      <Form>
        <Form.Control as="select" custom="true">
          {map(tunings, (t, i) => (
            <option key={i}>{t.Label}</option>
          ))}
        </Form.Control>
      </Form>
      {map(tunings, (t, i) => (
        <div className="tuning-selector" key={i}>
          {map(t.Offsets, (o, j) => (
            <DropOver
              disabled={true}
              currentIndex={findIndex(
                tuningNotes,
                (n) => n.value.Pitch === o.Pitch && n.value.Octave === o.Octave
              )}
              key={j}
              id={j.toString()}
              options={tuningNotes}
            />
          ))}
        </div>
      ))}
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
