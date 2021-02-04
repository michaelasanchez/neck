import { findIndex, map, maxBy } from 'lodash';
import * as React from 'react';

import { Diagram, DiagramSpan, DiagramSymbol, DiagramSymbolMap } from '.';
import { Note, NoteValue, ScaleVariation } from '../../../models';

export interface ScaleDiagramProps {
  active: boolean;
  highlighted: Note[];
  variation: ScaleVariation;
  setVariation: (variation: ScaleVariation) => void;
}

const calcSpan = (
  variation: ScaleVariation
): DiagramSpan => {
  return {
    min: variation.Offset,
    max: variation.Offset + maxBy(variation.Positions, (p) => p.length).length,
  };
};

const mapSymbols = (
  positions: Array<Array<number>>,
  highlighted: Array<Note>,
): DiagramSymbolMap => {
  return map(positions, (s) =>
    map(s, (f) => {
      if (!!f) {
        if (findIndex(highlighted, n => n.Degree === f) > -1) {
          if (f === 1) {
            return DiagramSymbol.HighlightedRoot;
          }
          return DiagramSymbol.Highlighted;
        }

        if (f === 1) {
          return DiagramSymbol.Root;
        }
        return DiagramSymbol.Note;
      }
      return DiagramSymbol.Empty;
    })
  );
};

export const ScaleDiagram: React.FC<ScaleDiagramProps> = ({
  setVariation,
  active,
  highlighted,
  variation,
}) => {

  return (
    <Diagram
      active={active}
      className="scale"
      diagramLabel={<>label</>}//{<>{variation.Label}</>}
      handleClick={() => setVariation(variation)}
      span={calcSpan(variation)}
      symbols={mapSymbols(variation.Positions, highlighted)}
    />
  );
};
