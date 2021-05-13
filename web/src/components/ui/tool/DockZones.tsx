import * as React from 'react';
import { useEffect, useState } from 'react';
import { useStyles } from '../../../hooks';

export enum DockDirection {
  Top,
  Right,
  Bottom,
  Left,
}

export interface DragState {
  dragging: boolean;
  x: number;
  y: number;
  mouseX?: number;
  mouseY?: number;
}

export interface DockState {
  docked: boolean;
  direction?: DockDirection;
}

const DockMargin = 40;

const debugHeight = { height: DockMargin };
const debugWidth = { width: DockMargin };

interface DockZonesProps {
  dockState: DockState;
  dragState: DragState;
  setPendingDockState: (updated: DockState) => void;
}

export const DockZones: React.FunctionComponent<DockZonesProps> = (props) => {
  const { dockState, dragState, setPendingDockState: setDockState } = props;

  const { navbar } = useStyles();

  const topHover = dragState?.mouseY < DockMargin;
  const rightHover = dragState?.mouseX > window.innerWidth - DockMargin;
  const bottomHover =
    dragState?.mouseY >
    window.innerHeight - DockMargin - (navbar.height as number);
  const leftHover = dragState?.mouseX < DockMargin;

  useEffect(() => {
    const docked = topHover || rightHover || bottomHover || leftHover;
    let direction = null;

    if (topHover) {
      direction = DockDirection.Top;
    } else if (rightHover) {
      direction = DockDirection.Right;
    } else if (bottomHover) {
      direction = DockDirection.Bottom;
    } else if (leftHover) {
      direction = DockDirection.Left;
    }


    if (dockState.docked != docked || dockState.direction !== direction) {
      setDockState({
        docked: docked ? true : false,
        direction,
      });
    }
  }, [dragState]);

  return (
    <div className={`dock-zones${!!dragState?.dragging ? ' show' : ''}`}>
      <div
        className={`zone top${topHover ? ' hover' : ''}`}
        style={debugHeight}
      ></div>
      <div
        className={`zone right${rightHover ? ' hover' : ''}`}
        style={debugWidth}
      ></div>
      <div
        className={`zone bottom${bottomHover ? ' hover' : ''}`}
        style={debugHeight}
      ></div>
      <div
        className={`zone left${leftHover ? ' hover' : ''}`}
        style={debugWidth}
      ></div>
    </div>
  );
};
