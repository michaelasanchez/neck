import * as React from 'react';
import Draggable from 'react-draggable';
import { OptionsModal, Notifications, Navbar } from '.';
import { useNotificationContext, IndicatorsMode } from '..';
import { useAppOptionsContext } from '../..';
import { Key } from '../../models';
import { FretDisplayMode } from '../neck';
import { ScaleSlideIn, ChordSlideIn } from './slideins';
const STATIC_FRET_DISPLAY_MODE = FretDisplayMode.Note;

export interface UiProps {}

export interface UiState {
  showOptions: boolean;
}

export const Ui: React.FunctionComponent<UiProps> = ({}) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { key } = appOptions;

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
        setKey={(k: Key) => setAppOptions({ key: k })}
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
          <ScaleSlideIn
            collapse={appOptions.indicatorsMode !== IndicatorsMode.Scale}
          />
          <ChordSlideIn
            collapse={appOptions.indicatorsMode !== IndicatorsMode.Chord}
          />
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
