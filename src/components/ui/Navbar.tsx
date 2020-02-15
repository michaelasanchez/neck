import * as React from 'react'
import { map } from 'lodash'

import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { Key, Keys } from '../../models/Key';

export interface NavbarProps {
  show: any;
  test: any;
  setKey: Function;
  testKey: Key;
}

export class Navbar extends React.Component<NavbarProps, {}> {

  private keys: Key[];

  constructor(props: any) {
    super(props);

    this.keys = Keys.All();
  }

  handleShow() {
    this.props.show();
  }

  handleKeySelect(key: any) {
    const newKey = this.keys[parseInt(key)];
    this.props.setKey(newKey);
  }

  renderMenuItems() {
    return (
      <>

      </>
    );
  }

  render() {
    return (
      <nav className="navbar navbar-expand fixed-bottom justify-content-between navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Neck</a>
        <div className="navbar-nav">

          <form className="form-inline">
            <Button variant="outline-success" className="options" onClick={() => this.handleShow()}>
              Options
            </Button>

            <div className="nav-item btn-group dropup">
              <Dropdown as={ButtonGroup}>
                <Button variant="secondary">Key of {this.props.testKey.toString()}</Button>
                <Dropdown.Toggle split variant="secondary" id="dropdown-custom-2" />
                <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                  {map(this.keys, (key, index) =>
                    <Dropdown.Item className="dropdown-item" onSelect={(e: any) => this.handleKeySelect(e)} eventKey={index.toString()}>
                      {key.Root.toString()}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </form>

        </div>
      </nav>
    );
  }
}