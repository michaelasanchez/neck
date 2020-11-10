import * as React from 'react';

import { ChordDiagram, ChordSlideIn, Navbar, OptionsModal, SlideIn } from '.';
import { IndicatorsDisplayOptions } from '..';
import { Chord, ChordModifier, ChordVariation, Key, Mode, Note, Tuning } from '../../models';
import { IAppOptions } from '../../shared';
import { FretDisplayMode } from '../neck';

export interface UiProps {
  appOptions: IAppOptions;
  indicatorsOptions: IndicatorsDisplayOptions;
  setOptions: (options: Partial<IAppOptions>) => void;
}

export interface UiState {
  showOptions: boolean;
}

export const Ui: React.FunctionComponent<UiProps> = ({
  appOptions,
  indicatorsOptions,
  setOptions,
}) => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  const handleFretDisplayModeUpdate = (fretMode: FretDisplayMode) => {
    let updated: FretDisplayMode;
    switch (appOptions.fretMode) {
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
        musicKey={appOptions.key}
        showing={showOptions}
        setShowing={setShowOptions}
        show={() => setShowOptions(true)}
        setKey={(k: Key) => setOptions({ key: k })}
        setFretDisplayMode={handleFretDisplayModeUpdate}
      />
      <OptionsModal
        showing={showOptions}
        onHide={() => setShowOptions(false)}
        tuning={appOptions.tuning}
        mode={appOptions.mode}
        setTuning={(t: Tuning) => setOptions({ tuning: t })}
        setMode={(m: Mode) => setOptions({ mode: m })}
      />
      <ChordSlideIn appOptions={appOptions} />
    </>
  );
};
