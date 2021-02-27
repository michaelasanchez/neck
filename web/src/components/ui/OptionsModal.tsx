import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Accordion, Dropdown, Modal } from 'react-bootstrap';
import { RadioOptionCard, TuningOptionCard } from '.';
import { useAppOptionsContext } from '../..';
import { Mode, Tuning } from '../../models';
import { TuningApi } from '../../network';

export interface OptionsModalProps {
  showing: boolean;
  onHide: Function;
  setTuning: Function;
  setMode: Function;
}

export const OptionsModal: React.FunctionComponent<OptionsModalProps> = ({
  showing,
  onHide,
  setTuning,
  setMode,
}: OptionsModalProps) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { instrument, tuning, mode } = appOptions;

  const container = React.useRef();
  const [tunings, setTunings] = useState<Array<Tuning>>();

  useEffect(() => {
    reloadScaleVariation();
  }, []);

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
          <Accordion>
            <TuningOptionCard
              eventKey="0"
              instrument={instrument}
              tuning={tuning}
              setTuning={(t: Tuning) => setAppOptions({ tuning: t })}
            />
            <RadioOptionCard
              eventKey="1"
              title="Mode"
              value={mode}
              options={Mode.All()}
              setValue={(m: Mode) => setMode(m)}
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
