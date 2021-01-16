import { map, maxBy } from 'lodash';
import * as React from 'react';

import { Diagram } from '.';
import { ScaleVariation } from '../../../models';

export interface ScaleDiagramProps {
  active: boolean;
  variation: ScaleVariation;
  setVariation: (variation: ScaleVariation) => void;
}

const calcMinMax = (
  variation: ScaleVariation
): { min: number; max: number } => {
  return {
    min: variation.Offset,
    max: variation.Offset + maxBy(variation.Positions, (p) => p.length)[0],
  };
};

export const ScaleDiagram: React.FC<ScaleDiagramProps> = ({
  setVariation,
  active,
  variation,
}) => {
  const { min: minPos, max: maxPos } = calcMinMax(variation);

  const renderFretSymbols = () => {
    return <div className="symbol string"></div>;
  };

  const diagramBody = (
    <>
      {map(variation.Positions, (s, i) => (
        <div className="string" key={i}>
          {map(s, (f, i) => (
            <div className="fret" key={i}>
              {renderFretSymbols()}
            </div>
          ))}
        </div>
      ))}
    </>
  );

  const diagramLabel = <>label</>;

  return (
    <Diagram
      active={active}
      className="scale"
      diagramBody={diagramBody}
      diagramLabel={diagramLabel}
      calcMinMax={() => calcMinMax(variation)}
      handleClick={() => setVariation(variation)}
      offset={variation.Offset}
      yes={true}
      strings={variation.Positions.length}
      frets={maxPos - minPos}
    />
  );
};
