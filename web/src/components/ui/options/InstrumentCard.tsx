import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { OptionCard, OptionCardProps } from '..';
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

  useEffect(() => {
    reloadInstruments();
  }, []);

  const reloadInstruments = () => {
    new InstrumentApi().GetAll().then((instruments) => {
      setInstruments(instruments);
    });
  };
  const body = (
    <>
      <Form>
        <Form.Control
          as="select"
          custom="true"
          value={instrument.Label}
          onChange={(e) => {
            let target: any = e.target;
            let index = target.selectedIndex;

            // TODO: HACK
            instruments[index].NumFrets = 12;

            setInstrument(instruments[index]);
          }}
        >
          {map(instruments, (t, i) => (
            <option key={i}>{t.Label}</option>
          ))}
        </Form.Control>
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
