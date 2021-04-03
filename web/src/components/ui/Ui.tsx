import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Draggable from 'react-draggable'; // Both at the same time
import { ChordSlideIn, Navbar, OptionsModal, ScaleSlideIn } from '.';
import { useNotificationContext } from '..';
import { useAppOptionsContext } from '../..';
import { Key } from '../../models';
import { IndicatorsMode } from '../Indicators';
import { Loading } from '../Loading';
import { FretDisplayMode } from '../neck';
import { Notifications } from './Notifications';
import { slideInDuration } from './slideins';

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

  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {}, [notifications]);

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
