import { join } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Accordion,
  Col,
  Form,
  Modal,
  Row,
  useAccordionToggle,
} from 'react-bootstrap';
import { CardAction, OptionCard } from '.';
import { useAppOptionsContext } from '../..';
import { Instrument, Tuning } from '../../models';
import { GeneralCard, InstrumentCard, TuningCard } from './options';

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
  const {
    instrument,
    tuning,
    leftHandUi
  } = appOptions;

  const container = React.useRef();

  const [activeKey, setActiveKey] = useState<string>();

  const [uiLeft, setUiLeft] = useState<boolean>();

  useEffect(() => {
    if (!showing) {
      const timeout = setTimeout(() => {
        setUiLeft(!!leftHandUi);
      }, 1000); // TODO: static
      return () => clearTimeout(timeout);
    }
  }, [leftHandUi, showing]);

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
        className={`lg${uiLeft ? ' left' : ''}`}
      >
        <Modal.Header closeButton>
          <Modal.Title>Options</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion
            onSelect={(key: any) => setActiveKey(key)}
            activeKey={activeKey}
          >
            <GeneralCard
              active={activeKey === CardKey.General}
              eventKey={CardKey.General}
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
