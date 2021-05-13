import * as React from 'react';
import { useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import {
  DockDirection,
  DockZones,
  DragState,
  MemoizedChordPanel,
  SearchPanel,
} from '.';
import { useAppOptionsContext } from '../../..';
import { IndicatorsMode } from '../indicators';
import { DockState } from './DockZones';
import { MemoizedScalePanel } from './panels/ScalePanel';

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

const DefaultDragState = { dragging: false, x: 30, y: 30 };

const UndockedDragStateOffset = { x: -200, y: -40 };

export const DefaultDockState: DockState = {
  docked: false,
  direction: null,
};

interface PanelContainerProps {}

export const PanelContainer: React.FunctionComponent<PanelContainerProps> = (
  props
) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { dockState, indicatorsMode } = appOptions;

  const [dragState, setDragState] = useState<DragState>(DefaultDragState);
  const [pendingDockState, setPendingDockState] =
    useState<DockState>(dockState);

  const [previousActiveMode, setPreviousActiveMode] =
    useState<IndicatorsMode>(null);
  const [previousIndicatorsMode, setPreviousIndicatorsMode] =
    useState<IndicatorsMode>(null);

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
    const { pageX: mouseX, pageY: mouseY } = e as MouseEvent;

    if (
      pendingDockState.docked != dockState.docked ||
      pendingDockState.direction !== dockState.direction
    ) {
      setAppOptions({ dockState: { ...pendingDockState } });
    }

    setDragState({
      ...dragState,
      x: data.x,
      y: data.y,
      mouseX,
      mouseY,
    });
  };

  const handleDragStart = (e: DraggableEvent, data: DraggableData) =>
    setDragState({
      ...dragState,
      x: dockState.docked ? (e as MouseEvent).pageX + UndockedDragStateOffset.x : dragState.x,
      y: dockState.docked ? (e as MouseEvent).pageY + UndockedDragStateOffset.y : dragState.y,
      dragging: true,
    });

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
        position={{ x: dragState.x, y: dragState.y }}
      >
        <div
          className={`panel-container${
            !!dockState.docked
              ? ` docked ${getDockDirectionClassName(dockState.direction)}`
              : ''
          }`}
        >
          <MemoizedChordPanel
            className={getPanelClassName(IndicatorsMode.Chord, dockState)}
            collapse={IndicatorsMode.Chord != indicatorsMode}
            docked={dockState.docked}
          />
          <MemoizedScalePanel
            className={getPanelClassName(IndicatorsMode.Scale, dockState)}
            collapse={IndicatorsMode.Scale != indicatorsMode}
            docked={dockState.docked}
          />
          <SearchPanel
            className={getPanelClassName(IndicatorsMode.Search, dockState)}
            collapse={IndicatorsMode.Search != indicatorsMode}
            docked={dockState.docked}
          />
        </div>
      </Draggable>
    </>
  );
};
