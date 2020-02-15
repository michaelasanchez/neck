import * as React from 'react'

import { Button, Modal } from 'react-bootstrap';

export interface OptionsProps {
  hide: Function;
  showing: any;
}

export const Options: React.FunctionComponent<OptionsProps> = ({ hide, showing}) => {
  return (
    <>
    <Modal id="options" show={showing} onHide={() => hide()}>
      <Modal.Header closeButton>
        <Modal.Title>Options</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Modal body text goes here.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => hide()}>Close</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}