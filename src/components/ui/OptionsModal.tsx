import * as React from 'react';
import { Accordion, Modal } from 'react-bootstrap';
import { RadioOptionCard } from '.';
import { Mode } from '../../models/mode';
import { Tuning } from '../../models/tuning';


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
            <RadioOptionCard
              eventKey="0"
              title="Tuning"
              value={tuning}
              options={Tuning.All()}
              setValue={(t: Tuning) => setTuning(t)}
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
    </>
  );
};
