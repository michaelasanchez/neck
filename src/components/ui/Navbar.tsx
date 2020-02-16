import * as React from 'react'
import { map } from 'lodash'

import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { Key, Keys } from '../../models/Key';

export interface NavbarProps {
  show: any;
  setKey: Function;
  defKey: Key;
}

export const Navbar: React.FunctionComponent<NavbarProps> = ({ show, setKey, defKey }) => {
  const keys = Keys.All();

  const handleSetKey = (keyString: string) => {
    setKey(keys[parseInt(keyString)]);
  }

  return (
    <nav className="navbar navbar-expand fixed-bottom justify-content-between navbar-dark bg-dark">
      <a className="navbar-brand" href="#">Neck</a>
      <div className="navbar-nav">

        <form className="form-inline">
          <Button variant="outline-success" className="options" onClick={() => show()}>
            Options
        </Button>

          <div className="nav-item btn-group dropup">
            <Dropdown as={ButtonGroup}>
              <Button variant="secondary">Key of {defKey.toString()}</Button>
              <Dropdown.Toggle split variant="secondary" id="dropdown-key" />
              <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                {map(keys, (key, index) =>
                  <Dropdown.Item
                    className="dropdown-item"
                    key={index}
                    onSelect={(e: string) => handleSetKey(e)}
                    eventKey={index.toString()}
                  >
                    {key.Root.toString()}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </form>

      </div>
    </nav>
  )
}