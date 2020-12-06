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

  const renderFretSymbols = (
    open: boolean,
    show: boolean,
    mute: boolean,
    barre: boolean,
    barreStart: boolean = false
  ) => {
    return (
      <>
        {!open && <div className="symbol string"></div>}
        {}
        {mute && <div className="symbol mute"></div>}
        {barre ? (
          <div className={`symbol barre${barreStart ? ' start' : ''}`}></div>
        ) : show ? (
          <div className="symbol dot"></div>
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <div className="diagram sm" onClick={() => handleClick({ chord })}>
      <span>{minPos != 0 && minPos}</span>
      {times(chord.Positions.length, (s) => {
        const barreStarted = s >= chord.Barres[0];
        const barreFret = chord.Positions[chord.Barres[0]];
        return (
          <div className="string" key={s}>
            {times(numFrets, (f) => {
              const show = chord.Positions[s] == f + minPos - paddingTop;
              const open = f == 0 && minPos - paddingTop < 1;
              const mute = chord.Positions[s] == null && f === 0;
              const barre =
                barreStarted && barreFret == f + minPos - paddingTop; // TODO: Supports single barre for now
              const barreStart = barre && s == chord.Barres[0];
              return (
                <div className={`fret${open ? ' open' : ''}`} key={f}>
                  {renderFretSymbols(open, show, mute, barre, barreStart)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
