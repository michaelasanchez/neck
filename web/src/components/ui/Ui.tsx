import * as React from 'react';
import { Button } from 'react-bootstrap';

import { ChordSlideIn, Navbar, OptionsModal, ScaleSlideIn } from '.';
import { Key, Mode, Tuning } from '../../models';
import { AppOptions } from '../../shared';
import { Indicators, IndicatorsMode } from '../Indicators';
import { FretDisplayMode } from '../neck';

const STATIC_FRET_DISPLAY_MODE = FretDisplayMode.Note;

export interface UiProps {
  appOptions: AppOptions;
  setAppOptions: (options: Partial<AppOptions>) => void;
}

export interface UiState {
  showOptions: boolean;
}

export const Ui: React.FunctionComponent<UiProps> = ({
  appOptions,
  setAppOptions,
}) => {
  // TODO: static
  let fretDisplayMode: FretDisplayMode = FretDisplayMode.Note;

  const { key, mode, tuning } = appOptions;

  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  const handleFretDisplayModeUpdate = (fretMode: FretDisplayMode) => {
    let updated: FretDisplayMode;
    switch (fretDisplayMode) {
      case FretDisplayMode.Degree:
        updated = FretDisplayMode.Marker;
        break;
      case FretDisplayMode.Marker:
        updated = FretDisplayMode.Note;
        break;
      case FretDisplayMode.Note:
        updated = FretDisplayMode.Degree;
        break;
    }
    // setAppOptions({ fretMode: updated });
  };

  // TODO: This renders three times
  console.log('UI RENDER');
  console.log(
    '----------------------------------------------------------------------'
  );

  const toggleIndicatorsMode = (mode: IndicatorsMode) => {
    const nextMode = mode === IndicatorsMode.Chord ? IndicatorsMode.Scale : IndicatorsMode.Chord;
    setAppOptions({ indicatorsMode: nextMode });
  };

  const renderModeSwitch = (mode: IndicatorsMode) => {
    let label: string;
    switch (mode) {
      case IndicatorsMode.Chord:
        label = 'Chord';
        break;
      case IndicatorsMode.Scale:
        label = 'Scale';
        break;
      case IndicatorsMode.Search:
        label = 'Search';
        break;
    }
    return (
      <Button
        className="mode-switch"
        onClick={() => toggleIndicatorsMode(mode)}
      >
        {label}
      </Button>
    );
  };

  return (
    <>
      <Navbar
        musicKey={key}
        showing={showOptions}
        setShowing={setShowOptions}
        show={() => setShowOptions(true)}
        setKey={(k: Key) => setAppOptions({ key: k })}
        setFretDisplayMode={handleFretDisplayModeUpdate}
      />
      {renderModeSwitch(appOptions.indicatorsMode)}
      <div className="modal-container">
        <OptionsModal
          showing={showOptions}
          onHide={() => setShowOptions(false)}
          tuning={tuning}
          mode={mode}
          setTuning={(t: Tuning) => setAppOptions({ tuning: t })}
          setMode={(m: Mode) => setAppOptions({ mode: m })}
        />
      </div>
      <ChordSlideIn appOptions={appOptions} setAppOptions={setAppOptions} />
      <ScaleSlideIn appOptions={appOptions} setAppOptions={setAppOptions} devYOffset={600} />
    </>
  );
};
