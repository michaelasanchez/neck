import { findIndex, map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { OptionCard } from '..';
import { Instrument, Tuning, TuningNote } from '../../../models';
import { TuningApi } from '../../../network';
import { DropOver, DropOverOption } from '../DropOver';

export interface TuningOptionCardOptions {
  eventKey: string;
  instrument: Instrument;
  tuning: Tuning;
  setTuning: (t: Tuning) => void;
}

export const TuningOptionCard: React.FunctionComponent<TuningOptionCardOptions> = (
  props
) => {
  const { eventKey, instrument, tuning } = props;

  const [tunings, setTunings] = useState<Array<Tuning>>();

  useEffect(() => {
    reloadScaleVariation();
  }, []);

  const reloadScaleVariation = () => {
    new TuningApi().ByInstrument(instrument.Id).then((tunings) => {
      setTunings(tunings);
    });
  };

  const header = (
    <>
      <h5>Tuning</h5>
      <h6 className="card-subtitle small text-muted">{tuning.Label}</h6>
    </>
  );

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
      <Form>
        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Label></Form.Label>
          <Form.Control as="select" custom="true">
            {map(tunings, (t, i) => (
              <option key={i}>{t.Label}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
    </>
  );

  return <OptionCard header={header} body={body} eventKey={eventKey} />;
};
