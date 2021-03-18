import * as React from 'react';
import { useEffect, useState } from 'react';
import { Accordion, Modal } from 'react-bootstrap';
import { RadioOptionCard } from '.';
import { useAppOptionsContext } from '../..';
import { Instrument, Mode, Tuning } from '../../models';
import { InstrumentCard, TuningCard } from './options';

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

  const [activeKey, setActiveKey] = useState<string>();

  useEffect(() => {
    if (!showing) setActiveKey(null);
  }, [showing]);

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
              title="Capo"
              value={{ Label: '(Coming Soon)' }}
              options={[]}
              setValue={(m: Mode) => {}}
            />
            <RadioOptionCard
              active={activeKey === '3'}
              eventKey="3"
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
