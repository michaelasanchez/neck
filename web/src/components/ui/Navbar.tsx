import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, SplitButton } from 'react-bootstrap';
import { useAppOptionsContext } from '../..';
import { Key } from '../../models';
import { Keys } from '../../shared';
import { IndicatorsMode } from './indicators/Indicators';

export interface NavbarProps {
  musicKey: Key;
  showing: boolean;
  className: string;
  setIndicatorsMode: (mode: IndicatorsMode) => void;
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
    default:
      return '';
  }
};

export const Navbar: React.FunctionComponent<NavbarProps> = ({
  showing,
  setShowing,
  setIndicatorsMode,
  musicKey,
  className,
}) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { indicatorsMode } = appOptions;

  const [lastIndicatorsMode, setLastIndicatorsMode] = useState<IndicatorsMode>(
    indicatorsMode || IndicatorsMode.Chord
  );
  useEffect(() => {
    if (indicatorsMode !== null) {
      setLastIndicatorsMode(indicatorsMode);
    }
  }, [indicatorsMode]);

  const size = 'lg';

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
              return (
                !isNaN(m) &&
                indicatorsMode !== m &&
                lastIndicatorsMode !== m && (
                  <Dropdown.Item
                    eventKey={key}
                    key={key}
                    onClick={() => setIndicatorsMode(m)}
                  >
                    {getModeTitle(m)}
                  </Dropdown.Item>
                )
              );
            })}
          </SplitButton>

          <DropdownButton
            drop="up"
            alignRight={true}
            className="key"
            size={size}
            title={musicKey.Label}
            variant="secondary"
          >
            {map(Keys.DropdownValues(), (k: Key, i: number) => {
              return (
                <Dropdown.Item
                  key={i}
                  onClick={() => setAppOptions({ key: k })}
                >
                  {k.Tonic.Label}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        </form>
      </div>
    </nav>
  );
};
