import * as React from 'react';
import { Navbar, Notifications, OptionsModal } from '.';
import { useAppOptionsContext } from '../..';
import { FretDisplayMode } from '../neck';
import { IndicatorsMode } from './indicators';
import { PanelContainer } from './tools';
const STATIC_FRET_DISPLAY_MODE = FretDisplayMode.Note;

export interface UiProps {}

export interface UiState {
  showOptions: boolean;
}

export const Ui: React.FunctionComponent<UiProps> = (props) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { indicatorsMode, key } = appOptions;

  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  return (
    <>
      {/* <Draggable cancel=".contents">
        <div
          className={`slidein-container${
            appOptions.leftHandMode ? ' left' : ''
          }${appOptions.leftHandUi ? ' ui-left' : ''}`}
        >
          <ScaleSlideIn collapse={indicatorsMode !== IndicatorsMode.Scale} />
          <ChordSlideIn collapse={indicatorsMode !== IndicatorsMode.Chord} />
          <SearchSlideIn collapse={indicatorsMode !== IndicatorsMode.Search} />
        </div>
      </Draggable> */}
      <PanelContainer />
      <Navbar
        musicKey={key}
        showing={showOptions}
        setShowing={setShowOptions}
        setIndicatorsMode={(mode: IndicatorsMode) =>
          setAppOptions({ indicatorsMode: mode })
        }
        className={`${appOptions.leftHandUi ? 'left' : ''}`}
      />
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
