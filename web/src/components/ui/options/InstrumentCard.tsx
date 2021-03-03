import * as $ from 'jquery';
import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { OptionCard, OptionCardProps } from '..';
import { Instrument } from '../../../models';
import { InstrumentApi } from '../../../network';
import { Confirmation } from '../Confirmation';

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
  const [pending, setPending] = useState<Instrument>(instrument);

  useEffect(() => {
    reloadInstruments();
  }, []);

  const reloadInstruments = () => {
    new InstrumentApi().GetAll().then((instruments) => {
      setInstruments(instruments);
    });
  };

  const handleUpdateNumFrets = (numFrets: number) => {
    instrument.NumFrets = numFrets;
    setInstrument(instrument);
  };

  const body = (
    <>
      <Form>
        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Control
                as="select"
                custom="true"
                value={instrument.Label}
                onChange={(e) => {
                  let target: any = e.target;
                  let index = target.selectedIndex;

                  // We keep this on FE for now
                  instruments[index].NumFrets = instrument.NumFrets;

                  setInstrument(instruments[index]);
                }}
              >
                {map(instruments, (t, i) => (
                  <option key={i}>{t.Label}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Form.Row>
      </Form>
      <Form inline>
        <Form.Label className="my-1 mr-2">
          <small>Strings</small>
        </Form.Label>
        <Form.Control
          disabled={true} // TODO: finish this
          value={pending?.NumStrings.toString()}
          onChange={(e: any) => {
            setPending({ ...pending, NumStrings: parseInt(e.target.value) });
          }}
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
          onChange={(e: any) => {
            setPending({ ...pending, NumFrets: parseInt(e.target.value) });
          }}
          onKeyDown={(e: any) => {
            if (e.keyCode === 13) {
              handleUpdateNumFrets(parseInt(e.target.value));
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
