import { max, min, times } from 'lodash';
import * as React from 'react';

import { ChordVariation } from '../../models';
import { IndicatorsDisplayOptions } from '../Indicators';

export const MIN_NUM_FRETS_DEFAULT = 4;
export const FRET_PADDING_DEFAULT = 1;

export interface ChordDiagramProps {
  chordVariation: ChordVariation;
  onClick: (options: Partial<IndicatorsDisplayOptions>) => void;
}

// const ROOT_POSITIONS = [false, true, false, false, true, false];

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chordVariation: chord,
  onClick: handleClick
}) => {
  const minPos = min(chord.Positions);
  const maxPos = max(chord.Positions);

  const numFrets = max([
    maxPos - minPos + 1 + FRET_PADDING_DEFAULT * 2,
    MIN_NUM_FRETS_DEFAULT,
  ]);

  return (
    <div
      className="diagram sm"
      style={{padding: '.5rem'}}
      onClick={() => handleClick({ chord })}
    >
      ({minPos})
      {times(chord.Positions.length, (s) => {
        return (
          <div className="string" key={s}>
            {times(numFrets, (f) => {
              return (
                <div className="fret" key={f}>
                  <div className="symbol string"></div>
                  {chord.Positions[s] == f + minPos - FRET_PADDING_DEFAULT ? (
                    // ROOT_POSITIONS[s] === true ? (
                    //   <div className="symbol dot root"></div>
                    // ) : (
                    <div className="symbol dot"></div>
                  ) : (
                    // )
                    <></>
                  )}
                  {chord.Positions[s] == null && f === 0 && (
                    <div className="symbol mute"></div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
