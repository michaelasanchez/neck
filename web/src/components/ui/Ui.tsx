import * as React from 'react';
import Draggable from 'react-draggable';
import { Navbar, Notifications, OptionsModal } from '.';
import { IndicatorsProvider, useNotificationContext } from '..';
import { useAppOptionsContext } from '../..';
import { Key } from '../../models';
import { FretDisplayMode } from '../neck';
import { IndicatorsMode } from './indicators';
import { ChordSlideIn, KeySelector, ScaleSlideIn, SearchSlideIn } from './slideins';
const STATIC_FRET_DISPLAY_MODE = FretDisplayMode.Note;

export interface UiProps {}

export interface UiState {
  showOptions: boolean;
}

export const Ui: React.FunctionComponent<UiProps> = ({}) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { indicatorsMode, key } = appOptions;

  const { notifications } = useNotificationContext();

  // TODO: static
  let fretDisplayMode: FretDisplayMode = FretDisplayMode.Note;

  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  React.useEffect(() => {}, [notifications]);

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
  };

  return (
    <>
      <Navbar
        musicKey={key}
        showing={showOptions}
        setShowing={setShowOptions}
        setIndicatorsMode={(mode: IndicatorsMode) =>
          setAppOptions({ indicatorsMode: mode })
        }
        className={`${appOptions.leftHandUi ? 'left' : ''}`}
      />
      <Draggable>
        <div
          className={`slidein-container${
            appOptions.leftHandMode ? ' left' : ''
          }${appOptions.leftHandUi ? ' ui-left' : ''}`}
        >
          <ScaleSlideIn collapse={indicatorsMode !== IndicatorsMode.Scale} />
          <ChordSlideIn collapse={indicatorsMode !== IndicatorsMode.Chord} />
          <SearchSlideIn collapse={indicatorsMode !== IndicatorsMode.Search} />
        </div>
      </Draggable>
      <div className={`ui${appOptions.leftHandUi ? ' left' : ''}`}>
        <div className="modal-container">
          <OptionsModal
            showing={showOptions}
            onHide={() => setShowOptions(false)}
          />
        </div>
        <Notifications />
      </div>
    </>
  );
};
