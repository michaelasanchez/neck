import { map } from 'lodash';
import * as React from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { Key, Keys } from '../../models/key';
import { FretDisplayMode } from '../neck';

export interface NavbarProps {
  musicKey: Key;
  showing: boolean;
  show: Function;
  setKey: Function;
  setFretDisplayMode: Function;
}

export const Navbar: React.FunctionComponent<NavbarProps> = ({
  show,
  showing,
  setKey,
  setFretDisplayMode,
  musicKey,
}) => {
  const keys = Keys.DropdownValues();

  const handleSetKey = (keyString: string) => setKey(keys[parseInt(keyString)]);

  const renderKeyDropdownMenu = () => {
    return (
      <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
        {map(keys, (key, index) => (
          <Dropdown.Item
            className="dropdown-item"
            key={index}
            eventKey={index.toString()}
            onSelect={(keyString: string) => handleSetKey(keyString)}
          >
            {key.Root.toString()}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    );
  };

  return (
    <nav className="navbar navbar-expand fixed-bottom justify-content-between navbar-dark bg-dark">
      <a className="navbar-brand" href="#">
        Neck
      </a>
      <div className="navbar-nav">
        <form className="form-inline">
          <Button
            variant="outline-success"
            className={showing ? 'options active' : 'options'}
            onClick={() => show()}
          >
            Options
          </Button>

          <div className="nav-item btn-group dropup">
            <Dropdown as={ButtonGroup}>
              <Button variant="secondary" onClick={() => setFretDisplayMode()}>
                Key of {musicKey.Name}
              </Button>
              <Dropdown.Toggle split variant="secondary" id="dropdown-key" />
              {renderKeyDropdownMenu()}
            </Dropdown>
          </div>
        </form>
      </div>
    </nav>
  );
};
