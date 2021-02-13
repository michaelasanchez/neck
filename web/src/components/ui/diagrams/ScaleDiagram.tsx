import { findIndex, map, maxBy } from 'lodash';
import * as React from 'react';
import { useCallback } from 'react';

import { Diagram, DiagramSpan, DiagramSymbol, DiagramSymbolMap } from '.';
import { Note, NoteValue, ScaleVariation } from '../../../models';

export interface ScaleDiagramProps {
  active: boolean;
  highlighted: Note[];
  variation: ScaleVariation;
  setVariation: (variation: ScaleVariation) => void;
}

const calcSpan = (variation: ScaleVariation): DiagramSpan => {
  return {
    min: variation.Offset,
    max: variation.Offset + maxBy(variation.Positions, (p) => p.length).length,
  };
};

const renderSymbol = (fretNum: number, highlighted: boolean): DiagramSymbol => {
  if (!!fretNum) {
    if (highlighted) {
      return fretNum === 1
        ? DiagramSymbol.HighlightedRoot
        : DiagramSymbol.Highlighted;
    }

    return fretNum === 1 ? DiagramSymbol.Root : DiagramSymbol.Note;
  }
  return DiagramSymbol.Empty;
};

const mapSymbols = (
  positions: Array<Array<number>>,
  highlighted: Array<Note>
): DiagramSymbolMap => {
  return map(positions, (s) =>
    map(s, (f) =>
      renderSymbol(f, findIndex(highlighted, (n) => n.Degree === f) > -1)
    )
  );
};

const mapSymbolsAgain = (
  positions: Array<Array<number>>,
  highlighted: Array<Note>
): DiagramSymbolMap =>
  map(positions, (s) =>
    map(s, (f) =>
      renderSymbol(f, findIndex(highlighted, (n) => n.Degree === f) > -1)
    )
  );

export const ScaleDiagram: React.FC<ScaleDiagramProps> = ({
  setVariation,
  active,
  highlighted,
  variation,
}) => {
  const renderSymbols = useCallback(() => {
    return mapSymbols(variation.Positions, highlighted);
  }, [variation, highlighted]);

  return (
    <Diagram
      active={active}
      className="scale"
      diagramLabel={<>label</>} //{<>{variation.Label}</>}
      handleClick={() => setVariation(variation)}
      span={calcSpan(variation)}
      symbols={renderSymbols()}
    />
  );
};
