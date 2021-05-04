import * as React from 'react';
import { useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { DockDirection, DockZones, DragState, ToolPanel } from '.';
import { useAppOptionsContext } from '../../..';
import { useStyles } from '../../../hooks';
import { IndicatorsMode } from '../indicators';
import { DockState, DefaultDockState } from './DockZones';
import { SearchPanel } from './SearchPanel';

const getPanelTypeClassName = (mode: IndicatorsMode) => {
  switch (mode) {
    case IndicatorsMode.Chord:
      return 'chord';
    case IndicatorsMode.Scale:
      return 'scale';
    case IndicatorsMode.Search:
      return 'search';
    default:
      return '';
  }
};

const getDockDirectionClassName = (direction: DockDirection) => {
  switch (direction) {
    case DockDirection.Top:
      return 'top';
    case DockDirection.Right:
      return 'right';
    case DockDirection.Bottom:
      return 'bottom';
    case DockDirection.Left:
      return 'left';
    default:
      return '';
  }
};

const filler = (
  <>
    do do do do do do do do do dod od od od od od od od odo od od odo do do do
    do do do do do do do do do do do do dod od d odo do dod od odo do do do do
    dod od od od odo do do do do do do do do do do do do do do do do do do d od
    od od do dod od do do do do do do do do do do do do do do do do d odo do dod
    od od od od od odo d od od od od od od od od od od od od od od odo do d od
    od odo do d od od od odo do do do do do do do do do do
  </>
);

interface PanelContainerProps {}

export const PanelContainer: React.FunctionComponent<PanelContainerProps> = (
  props
) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { dockState, indicatorsMode } = appOptions;

  const [dragState, setDragState] = useState<DragState>();
  const [pendingDockState, setPendingDockState] = useState<DockState>(
    DefaultDockState
  );

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

    return () => {
      setPreviousActiveMode(
        !indicatorsMode ? (indicatorsMode === 0 ? 0 : null) : indicatorsMode
      );
    };
  }, [indicatorsMode]);

  // Hack to keep expand animation after undocking
  useEffect(() => {
    if (!!dockState.docked && !transitionState) {
      setPreviousActiveMode(null);
      setTransitionState(true);
    }
  }, [dockState]);

  const getPanelClassName = (
    panelMode: IndicatorsMode,
    dockState: DockState
  ) => {
    let transitionClass = '';
    if (panelMode === indicatorsMode) {
      if (dockState.docked) {
        transitionClass = 'active';
      } else {
        transitionClass = transitionState ? 'expand' : 'active';
      }
    } else if (panelMode === previousActiveMode) {
      transitionClass = transitionState ? 'collapse' : 'previous';
    }

    return transitionClass;
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    const { pageX, pageY } = e as MouseEvent;
    setDragState({ ...dragState, pageX, pageY });

    if (
      pendingDockState.docked != dockState.docked ||
      pendingDockState.direction !== dockState.direction
    ) {
      setAppOptions({ dockState: { ...pendingDockState } });
    }
  };

  const handleDragStart = (e: DraggableEvent, data: DraggableData) =>
    setDragState({ ...dragState, dragging: true });
  const handleDragStop = (e: DraggableEvent, data: DraggableData) =>
    setDragState({ ...dragState, dragging: false });

  return (
    <>
      <DockZones
        dockState={pendingDockState}
        dragState={dragState}
        setPendingDockState={setPendingDockState}
      />
      <Draggable
        cancel=".content"
        onDrag={handleDrag}
        onStart={handleDragStart}
        onStop={handleDragStop}
        defaultPosition={{ x: 30, y: 30 }}
      >
        <div
          className={`panel-container${
            !!dockState.docked
              ? ` docked ${getDockDirectionClassName(dockState.direction)}`
              : ''
          }`}
        >
          <ToolPanel
            className={`${getPanelTypeClassName(
              IndicatorsMode.Scale
            )} ${getPanelClassName(IndicatorsMode.Chord, dockState)}`}
            title="Chords"
          >
            {filler}
          </ToolPanel>
          <ToolPanel
            className={`${getPanelTypeClassName(
              IndicatorsMode.Scale
            )} ${getPanelClassName(IndicatorsMode.Scale, dockState)}`}
            title="Scales"
          >
            {filler}
          </ToolPanel>
          <SearchPanel
            className={getPanelClassName(IndicatorsMode.Search, dockState)}
          >
            {filler}
          </SearchPanel>
        </div>
      </Draggable>
    </>
  );
};
