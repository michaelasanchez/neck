import * as React from 'react'

import { Button, Modal } from 'react-bootstrap';
import { OptionsModel } from '../../models/options.model';

export interface OptionsProps {
  hide: any;
  options: OptionsModel;
}

export class Options extends React.Component<OptionsProps, {}> {

  constructor(props: any) {
    super(props);

    console.log('Options', this);
  }

  handleClose() {
    this.props.hide();
  }

  render() {

    return (
      <>
        <Modal id="options" show={this.props.options.show} onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
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