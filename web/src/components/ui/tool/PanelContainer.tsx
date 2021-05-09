import * as React from 'react';
import { useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import {
  ChordPanel,
  DockDirection,
  DockZones,
  DragState,
  SearchPanel,
  ToolPanel,
} from '.';
import { useAppOptionsContext } from '../../..';
import { IndicatorsMode } from '../indicators';
import { DefaultDockState, DockState } from './DockZones';
import { ScalePanel } from './panels/ScalePanel';

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
        cancel="button, .content"
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
          <ChordPanel
            className={getPanelClassName(IndicatorsMode.Chord, dockState)}
            collapse={IndicatorsMode.Chord != indicatorsMode}
          />
          <ScalePanel
            className={getPanelClassName(IndicatorsMode.Scale, dockState)}
            collapse={IndicatorsMode.Scale != indicatorsMode}
          />
          <SearchPanel
            className={getPanelClassName(IndicatorsMode.Search, dockState)}
            collapse={IndicatorsMode.Search != indicatorsMode}
          />
        </div>
      </Draggable>
    </>
  );
};
