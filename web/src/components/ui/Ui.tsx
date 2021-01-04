import * as React from 'react';

import { ChordSlideIn, Navbar, OptionsModal, ScaleSlideIn } from '.';
import { Key, Mode, Tuning } from '../../models';
import { AppOptions } from '../../shared';
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
      {/* <ChordSlideIn appOptions={appOptions} setAppOptions={setAppOptions} /> */}
      <ScaleSlideIn setAppOptions={setAppOptions} />
    </>
  );
};
