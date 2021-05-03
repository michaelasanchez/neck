import * as React from 'react';
import { useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { DockDirection, DockZones, DragState, ToolPanel } from '.';
import { useAppOptionsContext } from '../../..';
import { IndicatorsMode } from '../indicators';
import { DockState, DefaultDockState } from './DockZones';

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
  const { appOptions } = useAppOptionsContext();
  const { indicatorsMode } = appOptions;

  const [dragState, setDragState] = useState<DragState>();
  const [dockState, setDockState] = useState<DockState>(DefaultDockState);
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
    const typeClass = getPanelTypeClassName(panelMode);

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

    return `${typeClass} ${transitionClass}`;
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    const { pageX, pageY } = e as MouseEvent;
    setDragState({ ...dragState, pageX, pageY });

    if (
      pendingDockState.docked != dockState.docked ||
      pendingDockState.direction !== dockState.direction
    ) {
      setDockState({ ...pendingDockState });
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
        setDockState={(updated: DockState) => {
          setPendingDockState(updated);
        }}
      />
      <Draggable
        cancel=".content"
        onDrag={handleDrag}
        onStart={handleDragStart}
        onStop={handleDragStop}
      >
        <div
          className={`panel-container${
            !!dockState.docked
              ? ` docked ${getDockDirectionClassName(dockState.direction)}`
              : ''
          }`}
        >
          <ToolPanel
            className={`${getPanelClassName(IndicatorsMode.Chord, dockState)}`}
            title="Chords"
          >
            {filler}
          </ToolPanel>
          <ToolPanel
            className={`${getPanelClassName(IndicatorsMode.Scale, dockState)}`}
            title="Scales"
          >
            {filler}
          </ToolPanel>
          <ToolPanel
            className={`${getPanelClassName(IndicatorsMode.Search, dockState)}`}
            title="Search"
          >
            {filler}
          </ToolPanel>
        </div>
      </Draggable>
    </>
  );
};
