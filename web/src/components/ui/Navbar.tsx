import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  SplitButton
} from 'react-bootstrap';
import { useAppOptionsContext } from '../..';
import { Key } from '../../models';
import { Keys } from '../../shared';
import { IndicatorsMode } from './indicators/Indicators';
import { KeySlider } from './KeySlider';

export interface NavbarProps {
  musicKey: Key;
  showing: boolean;
  className: string;
  setIndicatorsMode: (mode: IndicatorsMode) => void;
  setKey: (key: Key) => void;
  setShowing: (showing: boolean) => void;
}

const getModeTitle = (mode: IndicatorsMode) => {
  switch (mode) {
    case IndicatorsMode.Chord:
      return 'Chord';
    case IndicatorsMode.Scale:
      return 'Scale';
    case IndicatorsMode.Search:
      return 'Search';
  }
};

export const Navbar: React.FunctionComponent<NavbarProps> = ({
  showing,
  setShowing,
  setKey,
  setIndicatorsMode,
  musicKey,
  className,
}) => {
  const { appOptions } = useAppOptionsContext();
  const { indicatorsMode } = appOptions;

  const keys = Keys.DropdownValues();

  const handleSetKey = (keyString: string) => setKey(keys[parseInt(keyString)]);

  const [lastIndicatorsMode, setLastIndicatorsMode] = useState<IndicatorsMode>(
    IndicatorsMode.Chord
  );

  useEffect(() => {
    if (indicatorsMode !== null) {
      setLastIndicatorsMode(indicatorsMode);
    }
  }, [indicatorsMode]);

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

  const size = 'lg';

  return (
    <nav
      className={`navbar navbar-dark bg-dark${className ? ` ${className}` : ''
        }`}
    >
      <a className="navbar-brand" href="#">
        Neck
      </a>

      <div className="navbar-nav">
        <form className="form-inline">
          <Button
            size={size}
            variant="outline-success"
            className={`options${showing ? ' active' : ''}`}
            onClick={() => setShowing(!showing)}
          >
            Options
          </Button>

          <SplitButton
            id="mode-select"
            alignRight={true}
            className={`mode${indicatorsMode !== null ? ' active' : ''}`}
            drop="up"
            size={size}
            variant={indicatorsMode !== null ? 'primary' : 'outline-primary'}
            title={getModeTitle(lastIndicatorsMode)}
            onClick={() =>
              setIndicatorsMode(
                indicatorsMode !== null ? null : lastIndicatorsMode
              )
            }
          >
            {map(IndicatorsMode, (m: IndicatorsMode, key: string) => {
              return !isNaN(m) && indicatorsMode !== m && lastIndicatorsMode !== m &&
                <Dropdown.Item
                  eventKey={key}
                  key={key}
                  onClick={() => setIndicatorsMode(m)}
                >
                  {getModeTitle(m)}
                </Dropdown.Item>;
            })}
          </SplitButton>

          <div className="nav-item btn-group dropup">
            <DropdownButton
              size={size}
              as={ButtonGroup}
              id="key-dropdown"
              variant="secondary"
              title={`${musicKey.Label}`}
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
