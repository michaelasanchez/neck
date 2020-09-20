import * as React from 'react';
import { Navbar, OptionsModal } from '.';
import { IOptions, Key, Mode, Tuning } from '../../models';
import { FretDisplayMode } from '../neck';

export interface UiProps {
  options: IOptions;
  setOptions: (options: Partial<IOptions>) => void;
}

export interface UiState {
  showOptions: boolean;
}

export const Ui: React.FunctionComponent<UiProps> = ({
  options,
  setOptions,
}) => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  const handleFretDisplayModeUpdate = (fretMode: FretDisplayMode) => {
    let updated: FretDisplayMode;
    switch (options.fretMode) {
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
    setOptions({ fretMode: updated });
  };

  return (
    <>
      <Navbar
        musicKey={options.key}
        showing={showOptions}
        setShowing={setShowOptions}
        show={() => setShowOptions(true)}
        setKey={(k: Key) => setOptions({ key: k })}
        setFretDisplayMode={handleFretDisplayModeUpdate}
      />
      <OptionsModal
        showing={showOptions}
        onHide={() => setShowOptions(false)}
        tuning={options.tuning}
        mode={options.mode}
        setTuning={(t: Tuning) => setOptions({ tuning: t })}
        setMode={(m: Mode) => setOptions({ mode: m })}
      />
    </>
  );
};
