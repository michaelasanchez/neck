import { map } from 'lodash';
import * as React from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { Key, Keys } from '../../models/key';
import { FretDisplayMode } from '../neck';
import { KeySlider } from './KeySlider';

export interface NavbarProps {
  musicKey: Key;
  showing: boolean;
  setShowing: (showing: boolean) => void;
  show: Function;
  setKey: Function;
  setFretDisplayMode: Function;
}

export const Navbar: React.FunctionComponent<NavbarProps> = ({
  show,
  showing,
  setShowing,
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
            className={`options ${showing ? 'active' : ''}`}
            onClick={() => setShowing(!showing)}
          >
            Options
          </Button>

          <div className="nav-item btn-group dropup">
            <DropdownButton
              as={ButtonGroup}
              id="key-dropdown"
              variant="secondary"
              title={`Key of ${musicKey.Name}`}
              disabled={showing}
            >
              <KeySlider setKey={(k: Key) => setKey(k)} />
            </DropdownButton>
          </div>
        </form>
      </div>
    </nav>
  );
};
