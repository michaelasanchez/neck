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
  onClick: handleClick,
}) => {
  const minPos = min(chord.Positions);
  const maxPos = max(chord.Positions);
  const paddingTop = (minPos == 0 ? 0 : 1) * FRET_PADDING_DEFAULT;
  const paddingBottom = 1 * FRET_PADDING_DEFAULT;
  const paddingTotal = paddingTop + paddingBottom;
  // 1 is inclusive
  const numFrets = max([
    maxPos - minPos + 1 + FRET_PADDING_DEFAULT * paddingTotal,
    MIN_NUM_FRETS_DEFAULT,
  ]);

  const renderFretSymbols = (open: boolean, show: boolean, mute: boolean) => {
    return (
      <>
        {!open && <div className="symbol string"></div>}
        {show ? <div className="symbol dot"></div> : <></>}
        {mute && <div className="symbol mute"></div>}
      </>
    );
  };

  return (
    <div
      className="diagram sm"
      onClick={() => handleClick({ chord })}
    >
      <span>{minPos != 0 && minPos}</span>
      {times(chord.Positions.length, (s) => {
        return (
          <div className="string" key={s}>
            {times(numFrets, (f) => {
              const show = chord.Positions[s] == f + minPos - paddingTop;
              const open = minPos == 0 && f == 0;
              const mute = chord.Positions[s] == null && f === 0;
              return (
                <div className={`fret${open ? ' open' : ''}`} key={f}>
                  {renderFretSymbols(open, show, mute)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
