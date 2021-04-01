import { map } from 'lodash';
import * as React from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { Key } from '../../models';
import { Keys } from '../../shared';
import { KeySlider } from './KeySlider';

export interface NavbarProps {
  musicKey: Key;
  showing: boolean;
  setShowing: (showing: boolean) => void;
  show: Function;
  setKey: Function;
  setFretDisplayMode: Function;
  className: string;
}

export const Navbar: React.FunctionComponent<NavbarProps> = ({
  show,
  showing,
  setShowing,
  setKey,
  setFretDisplayMode,
  musicKey,
  className,
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
            {key.Tonic.Label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    );
  };

  return (
    <nav
      className={`navbar navbar-dark bg-dark${
        className ? ` ${className}` : ''
      }`}
    >
      <a className="navbar-brand" href="#">
        Neck
      </a>

      <div className="navbar-nav">
        <form className="form-inline">
          <Button
            size="lg"
            variant="outline-success"
            className={`options ${showing ? 'active' : ''}`}
            onClick={() => setShowing(!showing)}
          >
            Options
          </Button>

          <div className="nav-item btn-group dropup">
            <DropdownButton
              size="lg"
              as={ButtonGroup}
              id="key-dropdown"
              variant="secondary"
              title={`Key of ${musicKey.Label}`}
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
