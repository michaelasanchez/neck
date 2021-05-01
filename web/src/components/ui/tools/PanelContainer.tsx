import * as React from 'react';
import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { ToolPanel } from '.';
import { useAppOptionsContext } from '../../..';
import { IndicatorsMode } from '../indicators';

interface PanelContainerProps {}

export const PanelContainer: React.FunctionComponent<PanelContainerProps> = (
  props
) => {
  const { appOptions } = useAppOptionsContext();
  const { indicatorsMode } = appOptions;

  const [previousActiveMode, setPreviousActiveMode] = useState<IndicatorsMode>(
    null
  );
  const [
    previousIndicatorsMode,
    setPreviousIndicatorsMode,
  ] = useState<IndicatorsMode>(null);

  const [transitionState, setTransitionState] = useState<boolean>(
    !indicatorsMode
  );

  useEffect(() => {
    setPreviousIndicatorsMode(indicatorsMode);
    setTransitionState(
      indicatorsMode === null || previousIndicatorsMode === null
    );

    // console.log('how bout now');
    // console.log(indicatorsMode === null || idontknow === null ? 'i\m thinking so' : 'no happen');

    return () => {
      // console.log('i\m called first', indicatorsMode, previousIndicatorsMode);
      setPreviousActiveMode(
        !indicatorsMode ? (indicatorsMode === 0 ? 0 : null) : indicatorsMode
      );
      // console.log('can we determine expand/collapse with this')
      // console.log(indicatorsMode, previousIndicatorsMode);
    };
  }, [indicatorsMode]);
  console.log(transitionState);

  const getActiveClassName = (panelMode: IndicatorsMode) => {
    switch (panelMode) {
      case indicatorsMode:
        return transitionState ? 'active expand' : 'active';
      case previousActiveMode:
        return transitionState ? 'collapse' : 'previous';
      default:
        return '';
    }
  };

  return (
    <Draggable cancel=".content">
      <div className="panel-container">
        <ToolPanel
          className={`${getActiveClassName(IndicatorsMode.Chord)}`}
          title="Chords"
        />
        <ToolPanel
          className={`${getActiveClassName(IndicatorsMode.Scale)}`}
          title="Scales"
        />
        <ToolPanel
          className={`${getActiveClassName(IndicatorsMode.Search)}`}
          title="Search"
        />
      </div>
    </Draggable>
  );
};
