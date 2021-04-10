import { findIndex, map, maxBy, times } from 'lodash';
import * as React from 'react';
import { useCallback } from 'react';

import { Diagram, DiagramSpan, DiagramSymbol, DiagramSymbolMap } from '.';
import { Note, ScaleVariation } from '../../../models';

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
  span: DiagramSpan,
  positions: Array<Array<number>>,
  highlighted: Array<Note>
): DiagramSymbolMap => {
  return times(span.max - span.min, (f) =>
    times(positions.length, (i) => {
      const degree = positions[i][f];

      return renderSymbol(
        degree,
        findIndex(highlighted, (n) => n.Degree === degree) > -1
      );
    })
  );
};
export const ScaleDiagram: React.FC<ScaleDiagramProps> = ({
  setVariation,
  active,
  highlighted,
  variation,
}) => {
  const renderSymbols = useCallback(() => {
    return mapSymbols(calcSpan(variation), variation.Positions, highlighted);
  }, [variation, highlighted]);
  return (
    <Diagram
      active={active}
      className="scale"
      diagramLabel={<></>} //{<>{variation.Label}</>}
      handleClick={() => setVariation(variation)}
      span={calcSpan(variation)}
      symbols={renderSymbols()}
    />
  );
};
