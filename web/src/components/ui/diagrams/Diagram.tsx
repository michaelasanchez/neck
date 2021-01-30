import { map, max, times } from 'lodash';
import * as React from 'react';

export const ALWAYS_SHOW_OFFSET = false;

export const USE_FRET_PADDING = true;
export const FRET_PADDING_SIZE = 1;
export const NO_FRET_PADDING_AT_OR_BELOW = 1;

export const MIN_NUM_FRETS = 4;

export interface DiagramProps {
  handleClick: () => void;
  active?: boolean;
  className?: string;
  diagramLabel: JSX.Element;
  size?: DiagramSize;
  span: DiagramSpan;
  symbols: DiagramSymbolMap;
}

export enum DiagramSize {
  Small = 'sm',
  Medium = 'md',
  Normal = '',
}

export type DiagramSpan = { min: number; max: number };

export enum DiagramSymbol {
  Empty,
  Note,
  Root,
}

export type DiagramSymbolMap = Array<Array<DiagramSymbol>>;

export const Diagram: React.FC<DiagramProps> = ({
  span,
  handleClick,
  active,
  className = '',
  size = DiagramSize.Small,
  diagramLabel,
  symbols,
}) => {
  /* Frets / Fret Padding */
  const { min: minPos, max: maxPos } = span;

  const paddingTop =
    (minPos <= NO_FRET_PADDING_AT_OR_BELOW ? 0 : USE_FRET_PADDING ? 1 : 0) *
    FRET_PADDING_SIZE;
  const paddingBottom = (USE_FRET_PADDING ? 1 : 0) * FRET_PADDING_SIZE;
  const paddingTotal = paddingTop + paddingBottom;

  /* Dimensions */
  const numStrings = symbols.length;
  const numFrets = max([
    maxPos - minPos + FRET_PADDING_SIZE * paddingTotal,
    MIN_NUM_FRETS,
  ]);

  /* Outline & Fret Offset Label */
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

  const renderSymbol = (symbol: DiagramSymbol): JSX.Element => {
    switch (symbol) {
      case DiagramSymbol.Note:
        return <div className={`dot`}></div>;
      case DiagramSymbol.Root:
        return <div className={`dot root`}></div>;
      case DiagramSymbol.Empty:
      default:
        return;
    }
  };

  return (
    <div
      className={`diagram ${size} ${active ? 'active' : ''} ${className}`}
      onClick={handleClick}
    >
      <div className="diagram-outline" style={outlineStyle}></div>

      <div
        className={`diagram-container ${
          minPos < NO_FRET_PADDING_AT_OR_BELOW ? 'open' : ''
        } ${minPos === NO_FRET_PADDING_AT_OR_BELOW ? 'first' : ''}`}
      >
        <span ref={offsetSpan} style={spanStyle}>
          {(minPos > 1 || ALWAYS_SHOW_OFFSET) && minPos}
        </span>
        <>
          <div className="strings">
            {times(numStrings, (s) => (
              <div key={s}>
                <div></div>
              </div>
            ))}
          </div>

          <div className="frets">
            {times(numFrets, (f) => (
              <div key={f}></div>
            ))}
          </div>

          <div className="symbols">
            {map(symbols, (s, i) => (
              <div key={i}>
                {times(paddingTop, (f) => (
                  <div className="fret" key={f}></div>
                ))}
                {map(s, (f, j) => (
                  <div key={j}>{renderSymbol(f)}</div>
                ))}
                {times(paddingBottom, (f) => (
                  <div className="fret" key={f}></div>
                ))}
              </div>
            ))}
          </div>
        </>
      </div>
      <div className="label-container">{diagramLabel}</div>
    </div>
  );
};
