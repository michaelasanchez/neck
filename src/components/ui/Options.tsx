import * as React from 'react'

import { Button, Modal } from 'react-bootstrap';

export interface OptionsProps {
  hide: Function;
  showing: any;
}

export class Options extends React.Component<OptionsProps, {}> {

  constructor(props: any) {
    super(props);
  }

  handleClose() {
    this.props.hide();
  }

  render() {

    return (
      <>
        <Modal id="options" show={this.props.showing} onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Options</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Modal body text goes here.</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}