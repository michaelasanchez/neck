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

  const { notifications } = useNotificationContext();

  // TODO: static
  let fretDisplayMode: FretDisplayMode = FretDisplayMode.Note;

  const { indicatorsMode, key, mode, tuning } = appOptions;

  const [showOptions, setShowOptions] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(false);

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

  const toggleIndicatorsMode = (mode: IndicatorsMode) => {
    setDisabled(true);
    const timer = setTimeout(() => {
      setDisabled(false);
    }, slideInDuration);
    const nextMode =
      mode === IndicatorsMode.Chord
        ? IndicatorsMode.Scale
        : IndicatorsMode.Chord;
    setAppOptions({ indicatorsMode: nextMode });
    return () => {
      setDisabled(false);
      clearTimeout(timer);
    };
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
        disabled={disabled}
      >
        {disabled ? (
          <Loading showLoadingText={false} variant={'light'} inline={true} />
        ) : (
          label
        )}
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
        {renderModeSwitch(appOptions.indicatorsMode)}
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
