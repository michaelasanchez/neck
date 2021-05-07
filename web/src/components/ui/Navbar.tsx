import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, SplitButton } from 'react-bootstrap';
import { useAppOptionsContext } from '../..';
import { useStyles } from '../../hooks';
import { Key } from '../../models';
import { Keys } from '../../shared';
import { IndicatorsMode } from './indicators/Indicators';
import { KeySelector } from './slideins';

export const USE_CIRCLE_OF_5THS = true;

export interface NavbarProps {
  musicKey: Key;
  showOptions: boolean;
  className: string;
  setIndicatorsMode: (mode: IndicatorsMode) => void;
  setShowOptions: (showing: boolean) => void;
}

const getModeTitle = (mode: IndicatorsMode) => {
  switch (mode) {
    case IndicatorsMode.Chord:
      return 'Chords';
    case IndicatorsMode.Scale:
      return 'Scales';
    case IndicatorsMode.Search:
      return 'Search';
    default:
      return '';
  }
};

export const Navbar: React.FunctionComponent<NavbarProps> = ({
  className,
  musicKey,
  showOptions,
  setShowOptions,
  setIndicatorsMode,
}) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { indicatorsMode } = appOptions;

  const { mobile } = useStyles();

  const [showKeySelector, setShowKeySelector] = useState<boolean>(false);

  const [lastIndicatorsMode, setLastIndicatorsMode] = useState<IndicatorsMode>(
    indicatorsMode || IndicatorsMode.Chord
  );
  useEffect(() => {
    if (indicatorsMode !== null) {
      setLastIndicatorsMode(indicatorsMode);
    }
  }, [indicatorsMode]);

  const size = mobile ? null : 'lg';

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
            className={`options${showOptions ? ' active' : ''}`}
            onClick={() => setShowOptions(!showOptions)}
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

          {/* <span className="key-label"> */}
          {/* <span className="text-muted">in the</span> */}
          {/* Key of
          </span> */}

          <DropdownButton
            drop="up"
            alignRight={true}
            className="key"
            size={size}
            title={`Key of ${musicKey.Label}`}
            variant={showKeySelector ? 'secondary' : 'outline-secondary'}
            renderMenuOnMount={true}
            show={showKeySelector}
            onToggle={(updated) => setShowKeySelector(updated)}
          >
            {USE_CIRCLE_OF_5THS ? (
              <KeySelector
                active={musicKey}
                setActive={(k) => setAppOptions({ key: k })}
              />
            ) : (
              map(Keys.DropdownValues(), (k: Key, i: number) => {
                return (
                  <Dropdown.Item
                    key={i}
                    onClick={() => setAppOptions({ key: k })}
                  >
                    {k.Tonic.Label}
                  </Dropdown.Item>
                );
              })
            )}
          </DropdownButton>
        </form>
      </div>
    </nav>
  );
};
