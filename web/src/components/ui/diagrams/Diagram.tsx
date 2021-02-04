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
  span: DiagramSpan;
  symbols: DiagramSymbolMap;
  barres?: DiagramBarreMap;
}
export type DiagramSpan = { min: number; max: number };

export enum DiagramSymbol {
  Empty,
  Note,
  Root,
  Highlighted,
  HighlightedRoot,
}

export type DiagramSymbolMap = Array<Array<DiagramSymbol>>;

export type DiagramBarreMap = Array<number>;

const renderPadding = (amount: number) =>
  times(amount, (p) => <div key={p}></div>);

const renderSymbol = (symbol: DiagramSymbol): React.ReactElement => {
  if (symbol === DiagramSymbol.Empty) return;

  let symbolClass = 'dot';
  if (
    symbol === DiagramSymbol.Root ||
    symbol === DiagramSymbol.HighlightedRoot
  ) {
    symbolClass += ' root';
  }
  if (
    symbol === DiagramSymbol.Highlighted ||
    symbol === DiagramSymbol.HighlightedRoot
  ) {
    symbolClass += ' highlight';
  }

  return <div className={symbolClass}></div>;
};

const renderBarre = (
  numStrings: number,
  startString: number
): React.ReactElement[] => {
  return times(numStrings + 1, (s) => {
    return <div key={s} className={s > startString ? 'barre' : ''}></div>;
  });
};

export const Diagram: React.FC<DiagramProps> = ({
  span,
  handleClick,
  active,
  className = '',
  diagramLabel,
  symbols,
  barres,
}) => {
  /* Frets / Fret Padding */
  const paddingTop =
    (span.min <= NO_FRET_PADDING_AT_OR_BELOW ? 0 : USE_FRET_PADDING ? 1 : 0) *
    FRET_PADDING_SIZE;
  const paddingBottom = (USE_FRET_PADDING ? 1 : 0) * FRET_PADDING_SIZE;
  const paddingTotal = paddingTop + paddingBottom;

  /* Dimensions */
  const numStrings = symbols.length;
  const numFrets = max([
    span.max - span.min + FRET_PADDING_SIZE * paddingTotal,
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
    transform: `translateX(${-offsetWidth})`,
  };

  return (
    <div
      className={`diagram${active ? ' active' : ''} ${className}`}
      onClick={handleClick}
    >
      <div className="diagram-outline" style={outlineStyle}></div>

      <div
        className={`diagram-container${
          span.min < NO_FRET_PADDING_AT_OR_BELOW ? ' open' : ''
        }${span.min > 0 && span.min <= 2 ? ' first' : ''}`}
      >
        <span ref={offsetSpan} style={spanStyle}>
          {(span.min > 1 || ALWAYS_SHOW_OFFSET) && span.min}
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
                {renderPadding(paddingTop)}
                {map(s, (f, j) => (
                  <div key={j}>{renderSymbol(f)}</div>
                ))}
                {renderPadding(paddingBottom)}
              </div>
            ))}
          </div>

          {barres && (
            <div className="barres">
              {renderPadding(paddingTop)}
              {map(barres, (s, i) => (
                <div key={i}>{s !== null && renderBarre(numStrings, s)}</div>
              ))}
              {renderPadding(paddingBottom)}
            </div>
          )}
        </>
      </div>
      <div className="label-container">{diagramLabel}</div>
    </div>
  );
};
