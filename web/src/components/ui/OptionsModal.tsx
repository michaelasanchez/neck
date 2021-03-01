import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Accordion, Dropdown, Modal } from 'react-bootstrap';
import { RadioOptionCard, InstrumentCard, TuningCard } from '.';
import { useAppOptionsContext } from '../..';
import { Instrument, Mode, Tuning } from '../../models';
import { TuningApi } from '../../network';

export interface OptionsModalProps {
  showing: boolean;
  onHide: Function;
}

export const OptionsModal: React.FunctionComponent<OptionsModalProps> = ({
  showing,
  onHide,
}: OptionsModalProps) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { instrument, tuning, mode } = appOptions;

  const container = React.useRef();
  const [tunings, setTunings] = useState<Array<Tuning>>();

  const [activeKey, setActiveKey] = useState<string>();

  useEffect(() => {
    reloadScaleVariation();
  }, []);

  useEffect(() => {
    if (!showing) setActiveKey(null);
  }, [showing]);

  const reloadScaleVariation = () => {
    new TuningApi().ByInstrument(instrument.Id).then((tunings) => {
      setTunings(tunings);
    });
  };

  return (
    <div className="options-container" ref={container}>
      <Modal
        id="options"
        show={showing}
        onHide={() => onHide()}
        container={container}
        className="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Options</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion onSelect={(key: any) => setActiveKey(key)}>
            <InstrumentCard
              active={activeKey === '0'}
              eventKey="0"
              instrument={instrument}
              setInstrument={(i: Instrument) =>
                setAppOptions({ instrument: i, tuning: i.DefaultTuning })
              }
            />
            <TuningCard
              active={activeKey === '1'}
              eventKey="1"
              instrument={instrument}
              tuning={tuning}
              setTuning={(t: Tuning) => setAppOptions({ tuning: t })}
            />
            <RadioOptionCard
              active={activeKey === '2'}
              eventKey="2"
              title="Mode"
              value={mode}
              options={Mode.All()}
              setValue={(m: Mode) => setAppOptions({ mode: m })}
            />
          </Accordion>
        </Modal.Body>

        <Modal.Footer>
          {/* <Button variant="secondary" onClick={() => hide()}>Close</Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};
