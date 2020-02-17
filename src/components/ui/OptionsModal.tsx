import * as React from 'react';

import { Accordion, Button, Modal } from 'react-bootstrap';
import { Option } from './Option';
import { Tuning } from '../../models/Tuning';
import { Mode } from '../../models/Mode';

export interface OptionsModalProps {
  showing: boolean;
  tuning: Tuning;
  mode: Mode;
  hide: Function;
  setTuning: Function;
  setMode: Function;
}

export const OptionsModal: React.FunctionComponent<OptionsModalProps> = ({ showing, tuning, mode, hide, setTuning, setMode }: OptionsModalProps) => {
  return (
    <>
      <Modal id="options" show={showing} onHide={() => hide()}>
        <Modal.Header closeButton>
          <Modal.Title>Options</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion>
            <Option
              eventKey="0"
              type="radio"
              header="Tuning"
              value={tuning}
              options={Tuning.All()}
              setValue={(t: Tuning) => setTuning(t)}
            />
            <Option
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
          <Button variant="secondary" onClick={() => hide()}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}