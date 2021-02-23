import { map, max, times } from 'lodash';
import * as React from 'react';

export const ALWAYS_SHOW_OFFSET = false;

export const USE_FRET_PADDING = true;
export const FRET_PADDING_SIZE = 1;
export const NO_FRET_PADDING_AT_OR_BELOW = 1;

export interface DiagramProps {
  handleClick: () => void;
  active?: boolean;
  className?: string;
  diagramLabel: JSX.Element;
  span: DiagramSpan;
  symbols: DiagramSymbolMap;
  header?: DiagramHeaderMap;
  barres?: DiagramBarreMap;
}

export type DiagramSpan = { min: number; max: number };

export enum DiagramSymbol {
  Empty,
  Mute,
  Note,
  Root,
  Highlighted,
  HighlightedRoot,
}

export type DiagramHeaderMap = Array<DiagramSymbol>;

export type DiagramSymbolMap = Array<Array<DiagramSymbol>>;

export type DiagramBarreMap = Array<Array<boolean>>;

const renderPadding = (amount: number) =>
  times(amount, (p) => <div key={p}></div>);

const renderSymbol = (symbol: DiagramSymbol): React.ReactElement => {
  if (symbol === DiagramSymbol.Empty) return;

  let symbolClass = symbol === DiagramSymbol.Mute ? 'mute' : 'dot';

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

const renderBarre = (barre: Array<boolean>): React.ReactElement[] => {
  return times(barre.length + 1, (i) => (
    <div key={i} className={i < barre.length && barre[i] ? 'barre' : ''}></div>
  ));
};

export const Diagram: React.FC<DiagramProps> = ({
  span,
  handleClick,
  active,
  className = '',
  diagramLabel,
  symbols,
  header,
  barres,
}) => {
  /* Frets / Fret Padding */
  const paddingTop =
    (span.min <= NO_FRET_PADDING_AT_OR_BELOW ? 0 : USE_FRET_PADDING ? 1 : 0) *
      FRET_PADDING_SIZE;
  const paddingBottom = (USE_FRET_PADDING ? 1 : 0) * FRET_PADDING_SIZE;
  const paddingTotal = paddingTop + paddingBottom;

  /* Dimensions */
  const numStrings = symbols[0].length;
  const numFrets = span.max - span.min + FRET_PADDING_SIZE * paddingTotal - (span.min === 0 ? 1 : 0);

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

  React.useEffect(() => {
    console.log(symbols, header, barres)
  }, [symbols, header, barres]);

  return (
    <div
      className={`diagram ${className}${active ? ' active' : ''}`}
      onClick={handleClick}
    >
      <div className="diagram-outline" style={outlineStyle}></div>

      <div
        className={`diagram-container${
          span.min < NO_FRET_PADDING_AT_OR_BELOW ? ' open' : ''
        }${span.min > 0 && span.min <= 2 ? ' first' : ''}${
          header ? ' with-header' : ''
        }`}
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
            {header && <div className="header"></div>}
            {times(numFrets, (f) => (
              <div key={f}></div>
            ))}
          </div>

          <div className="symbols">
            {header && (
              <div className="header">
                {map(header, (s, i) => (
                  <div key={i}>{renderSymbol(s)}</div>
                ))}
              </div>
            )}
            {renderPadding(paddingTop)}
            {map(symbols, (s, i) => (
              <div key={i}>
                {map(s, (f, j) => (
                  <div key={j}>{renderSymbol(f)}</div>
                ))}
              </div>
            ))}
            {renderPadding(paddingBottom)}
          </div>

          {barres && barres.length > 0 && (
            <div className="barres">
              {header && <div className="header"></div>}
              {renderPadding(paddingTop)}
              {map(barres, (s, i) => (
                <div key={i}>{s !== null && renderBarre(s)}</div>
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
