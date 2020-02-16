import * as React from 'react';

import { Accordion, Card, Button, Modal } from 'react-bootstrap';
import { Option } from './Option';

export interface OptionsModalProps {
  hide: Function;
  showing: any;
}

export const OptionsModal: React.FunctionComponent<OptionsModalProps> = ({ hide, showing }) => {
  return (
    <>
      <Modal id="options" show={showing} onHide={() => hide()}>
        <Modal.Header closeButton>
          <Modal.Title>Options</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Accordion>
            <Option eventKey="0" header="Mode" body="Hello! I'm the body" />
            <Option eventKey="1" header="Tuning" body="Hello! I'm the body" />
          </Accordion>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => hide()}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}