import { map, times } from 'lodash';
import * as React from 'react';

export const MIN_NUM_FRETS_DEFAULT = 4;
export const FRET_PADDING_DEFAULT = 1;

export interface DiagramProps {
  calcMinMax?: () => { min: number, max: number };
  handleClick: () => void;
  active?: boolean;
  className?: string;
  size?: DiagramSize;
  offset: number;
  diagramBody: JSX.Element;
  diagramLabel: JSX.Element;
  yes?: boolean;
  strings?: number;
  frets?: number;
}

export enum DiagramSize {
  Small = 'sm',
  Medium = 'md',
  Normal = '',
}

export const Diagram: React.FC<DiagramProps> = ({
  calcMinMax,
  handleClick,
  active,
  className = '',
  size = DiagramSize.Small,
  offset = 0,
  diagramBody,
  diagramLabel,
  yes = false,
  strings = 0,
  frets = 0,
}) => {
  // const { min: minPos, max: maxPos } = calcMinMax();

  const offsetSpan = React.useRef();
  let offsetWidth = 0;

  const current = offsetSpan.current as HTMLElement;
  if (current) {
    offsetWidth = current.offsetWidth;
  }
  const outlineStyle = {
    width: `calc(100% + ${20 + offsetWidth}px)`,
    left: -10 - offsetWidth,
  };

  const spanStyle = {
    left: -4 - offsetWidth,
  };

  return (
    <div
      className={`diagram ${size} ${active && 'active'} ${className}`}
      onClick={handleClick}
    >
      <div className="diagram-outline" style={outlineStyle}></div>

      <div className="diagram-container">
        <span ref={offsetSpan} style={spanStyle}>
          {offset != 0 && offset}
        </span>
        {yes ? (
          <>
            <div className="strings">
              {times(strings, s => (
                <div key={s}><div></div></div>
              ))}
            </div>
            <div className="frets">
              {times(frets, f => (
                <div key={f}></div>
              ))}
            </div>
            {/* {diagramBody} */}
          </>
        ) : (
          diagramBody
        )}
      </div>
      <div className="label-container">{diagramLabel}</div>
    </div>
  );
};
