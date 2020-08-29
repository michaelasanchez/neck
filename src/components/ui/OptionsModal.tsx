import * as React from 'react';
import { Accordion, Modal } from 'react-bootstrap';
import { Mode } from '../../models/Mode';
import { Tuning } from '../../models/Tuning';
import { OptionCard } from './OptionCard';

export interface OptionsModalProps {
  showing: boolean;
  tuning: Tuning;
  mode: Mode;
  onHide: Function;
  setTuning: Function;
  setMode: Function;
}

export const OptionsModal: React.FunctionComponent<OptionsModalProps> = ({
  showing,
  tuning,
  mode,
  onHide,
  setTuning,
  setMode,
}: OptionsModalProps) => {
  return (
    <>
      <Modal id="options" show={showing} onHide={() => onHide()}>
        <Modal.Header closeButton>
          <Modal.Title>Options</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion>
            <OptionCard
              eventKey="0"
              type="radio"
              header="Tuning"
              value={tuning}
              options={Tuning.All()}
              setValue={(t: Tuning) => setTuning(t)}
            />
            <OptionCard
              eventKey="1"
              type="radio"
              header="Mode"
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
    </>
  );
};
