import * as React from 'react';
import { useEffect, useState } from 'react';
import { Accordion, Form, Modal, useAccordionToggle } from 'react-bootstrap';
import { CardAction, OptionCard } from '.';
import { useAppOptionsContext } from '../..';
import { Instrument, Tuning } from '../../models';
import { InstrumentCard, TuningCard } from './options';

export interface OptionsModalProps {
  showing: boolean;
  onHide: Function;
}

export enum CardKey {
  General = '0',
  Instrument = '1',
  Tuning = '2',
}

export const OptionsModal: React.FunctionComponent<OptionsModalProps> = ({
  showing,
  onHide,
}: OptionsModalProps) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { instrument, tuning, leftHandMode, leftHandUi } = appOptions;

  const container = React.useRef();

  const [activeKey, setActiveKey] = useState<string>();

  useEffect(() => {
    if (!showing) setActiveKey(null);
  }, [showing]);

  const handleCardAction = (action: CardAction, key: CardKey) => {
    if (action == CardAction.Open) {
      setActiveKey(key);
    }
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
          <Accordion
            onSelect={(key: any) => setActiveKey(key)}
            activeKey={activeKey}
          >
            <OptionCard
              active={activeKey === CardKey.General}
              eventKey={CardKey.General}
              title="General"
              subtitle={
                !leftHandMode
                  ? 'Default'
                  : !leftHandUi
                  ? 'Left-hand Guitar'
                  : 'Left-hand Mode'
              }
              body={
                <>
                  <Form.Group
                    onClick={(e: any) =>
                      setAppOptions({
                        leftHandMode: !leftHandMode,
                      })
                    }
                    className="clickable mb-1"
                  >
                    <Form.Check
                      type="checkbox"
                      label="Left-hand Guitar"
                      custom
                      checked={leftHandMode}
                      onChange={() => {}}
                    />
                  </Form.Group>
                  <Form.Group
                    onClick={(e: any) => {
                      setAppOptions({ leftHandUi: !leftHandUi });
                    }}
                    className="clickable mb-0"
                  >
                    <Form.Check
                      type="checkbox"
                      label="Left-hand UI"
                      custom
                      checked={leftHandUi}
                      onChange={() => {}}
                    />
                  </Form.Group>
                </>
              }
            />
            <InstrumentCard
              active={activeKey === CardKey.Instrument}
              eventKey={CardKey.Instrument}
              instrument={instrument}
              setInstrument={(i: Instrument) =>
                setAppOptions({ instrument: i, tuning: i.DefaultTuning })
              }
              onAction={handleCardAction}
            />
            <TuningCard
              active={activeKey === CardKey.Tuning}
              eventKey={CardKey.Tuning}
              instrument={instrument}
              tuning={tuning}
              setTuning={(t: Tuning) => setAppOptions({ tuning: t })}
            />
            {/* <RadioOptionCard
              active={activeKey === '3'}
              eventKey="3"
              title="Capo"
              value={{ Label: '(Coming Soon)' }}
              options={[]}
              setValue={(m: Mode) => { }}
            /> */}
            {/* <RadioOptionCard
              active={activeKey === '4'}
              eventKey="4"
              title="Mode"
              value={mode}
              options={Mode.All()}
              setValue={(m: Mode) => setAppOptions({ mode: m })}
            /> */}
          </Accordion>
        </Modal.Body>

        <Modal.Footer>
          {/* <Button variant="secondary" onClick={() => hide()}>Close</Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};
