import { max, min, times } from 'lodash';
import * as React from 'react';

import { ChordVariation } from '../../models';

export interface IChordDiagramProps {
  chordVariation: ChordVariation;
}

const ROOT_POSITIONS = [false, true, false, false, true, false];

export const ChordDiagram: React.FC<IChordDiagramProps> = ({
  chordVariation: chord,
}) => {
  const minPos = min(chord.Positions);
  const maxPos = max(chord.Positions);

  console.log(`min: ${minPos} max: ${maxPos}`);

  console.log(chord, chord.Positions.length);
  return (
    <div className="diagram">
      {times(chord.Positions.length, (s) => {
        return (
          <div className="string" key={s}>
            {times(maxPos - minPos + 1, (f) => {
              return (
                <div className="fret" key={f}>
                  <div className="symbol string"></div>
                  {chord.Positions[s] == f ? (
                    ROOT_POSITIONS[s] === true ? (
                      <div className="symbol dot root"></div>
                    ) : (
                      <div className="symbol dot"></div>
                    )
                  ) : (
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
